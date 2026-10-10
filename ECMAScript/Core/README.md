# Yamato Daiwa Serial Unique Identifiers

Generates IDs (currently NanoIDs only supported) in strict (_not_ random) order, herewith once all IDs will be 
  exhausted, the order will be reset but new IDs will be prefixed.
For example, if last nano ID of 0th series will be `---------------------` then next ID will be 
  `1~AAAAAAAAAAAAAAAAAAAAA` (`~` separator has been selected as URI-friendly one).
This way, the number or IDs limited only by the system resources.

+ [Motivation](#motivation)
+ [[FAQ] "So, the IDs collision probability will be 0% if to use this lib?"](#faq-so-the-ids-collision-probability-will-be-0-if-to-use-this-lib)
+ [Minimal Theory](#minimal-theory)
  + [Approach](#approach)
  + [Characters Sequence](#characters-sequence)
+ [API](#api)
  + [Issuers Classes](#issuers-classes)
    + [`PersistentSerialNanoIDsGenerator`](#persistentserialnanoidsgenerator)
      + [Protected Fields](#protected-fields) 
      + [Constructor](#constructor)
      + [Abstract Methods](#abstract-methods)
      + [Non-abstract Methods](#non-abstract-methods)
    

## Motivation

There is NO truly **universally unique identifiers**.
Although it is believed that the collision probability is extremely small, the following points are frequently 
  not being respected:

+ Basically the identifiers are been generated _randomly_ (without a certain sequence).
  It means, with each new generated ID the collision probability will increase.
+ In some cases the records number may be extremely large. For example:
  - The number of logs which can be measured in the thousands and this is not the limit. 
  - The number of comments from all users around the world in SNS like X of Facebook, or the task manager like Jira.

So from a practical point of view, the IDs collisions are _definitely possible_ and the developers of  
  **Yamato Daiwa Serial Unique Identifiers** believes that the ignoring of this problem is a kind of negligence
  unacceptable in high quality software development.


### [FAQ] "So, the IDs collision probability will be 0% if to use this lib?"

No, because there are more things which are not under our control:

+ **The external issuing of the IDs**: although we make set the **single IDs issuing source rule**, we can't guarantee 
    that this rule will be respected.
+ The incorrect usage of this library

And, as commonly known, the respecting of all possible factors and their combinations is impossible because there is
  an infinite number of these combinations.
As always, you are need to understand what are you doing, so check the following manual thoroughly.

Additionally, this library provides only the _base_ for the implementation of own IDs generators because the complete 
  IDs generator needs to store the data somehow, so it will be specific implementations for each data storing way.
Thereby **PersistentSerialNanoIDsGenerator** abstract class doing most work except the direct operations with the data 
  source. 


## Minimal Theory

From the viewpoint of this library's approach, there are the **5** kinds of IDs:

<dl>

  <dt>IDs which has not been issued yet</dt>
  <dd>
    The most obvious kind.
    From the viewpoint of approach of this library, there is an infinite number of such IDs.
    From the practical viewpoint, their number is limited only by system resources.
  </dd>

  <dt>Issued but has not been used yet IDs</dt>
  <dd>
    It should be the **single issuer of IDs** (per target entity such as specific database table).
    If there are multiple of them, then it is the favorable conditiona for the IDs collisions occurences.
    Once issuer has issued an ID, it will be considered as not used yet until the issuer will recieve the report about
      successfull usage if this ID.
  </dd>

  <dt>Issued but has become unnecessary IDs<dt>
  <dd>
    It may occur when the IDs issuer has issued the ID, but the saving of the data to a data source failed.
    When something like this happens, you <i>must</i> notify the issuer about unused ID to make possible the reissuing
      of this ID next time.
  </dd>

  <dt>Forbidden IDs</dt>
  <dd>
    As mentioned above, it should be the **single issuer of IDs**, however from a practical viewpoint anything may happen.
    The primary purpose of this group is the respecting of externally issued IDs.
    The other usages are project-specific.
  </dd>

  <dt>Issued and used IDs</dt>
  <dd>
    Once IDs issuer has been reported about successfull usage of the specific ID, this ID becomes belong to this category.
    Basically such IDs is continuing to belong to this category if users of this IDs (such as a database table)
      has been deleted because the reusage of IDs may cause the problems such as transfering of a sensetive data
      from one user to another one.
  </dd>

</dl>


### Approach

The following approach is _basic_, but it may be different depending of a specific implementation.
For instance, there is the simplified 100%-synchronous [InMemorySerialNanoID_Generator](#inmemoryserialnanoid_generator) 
  implementation for the usage only during local development but not intended to be used in production because
  it stores the data in RAM only.
So, the basic approach represented by [**PersistentSerialNanoIDsGenerator** abstract class](#persistentserialnanoidsgenerator) 
  is described below.

Once generating of new IDs requested:

1. First **PersistentSerialNanoIDsGenerator** will check is there some ID among **issued but has become unnecessary** ones,
     and if yes, such ID will be issued and added to the group or **issued but has not been used yet** ones.
2. If no IDs may be reused, the new [nanoid-like](https://github.com/ai/nanoid#readme) one will be issued. 
   The Nano ID can be considered as number of base 64 numeral system, and if to decide the characters order, the simple 
     arithmetics including incrementing will be available.
   To know which ID will be next, it is required to store either characters of previously issued IDs or characters
     of next available for usage ID (the **PersistentSerialNanoIDsGenerator** implements the second approach). 
   This part is relatively simple, but since last ID has been previously generated, new IDs of **forbidden IDs** group 
     may be registered, thus so-called "next available for usage ID" may become to not available anymore.
   It means that just generated ID must be checked for the availability and if it can not be used anymore then new ID
     must be issued.
   This _iterative_ process will continue until the generated ID will _actually_ be available for usage.
   Once it happen, the ID will be added to the group of **issued but has not been used yet** ones.
3. Once all IDs will be exhausted, the series prefix will be added (e. g. `1` in `1~AAAAAAAAAAAAAAAAAAAAA` where the `~`
     is URI-compatable prefix separator).

+ Once generated ID will be actually used (for instance, the row with this ID saved to the database), it is required
  to report that such ID as successfully used one.
+ If for some reson the generated ID has not been used (for instance, the error has occurred during an attempt to add 
    the row with this ID to the database), it is required to report that this ID has not been used thus can be safely 
    reused in the future.
  This does _not_ apply to the case when ID has been used but has become unnecessary because of, for instance, the 
    deleting of related database row, because in this case the reusage of ID may cause the problems such as transfering 
    of a sensetive data from one user to another one.

Another important thing must be respected is the _performance optimization_.
During this process, it will be may transactions with the data storage, but such transactions should be minimized
  as possible, especially when need to issue multiple IDs at once.


### Characters Sequence

As mentioned above, the Nano ID can be considered as a number of base 64 numeral system, but it is required to decide the
  characters sequence.
For this library, the following order is being used:

1. Uppercase Latin characters (from "A" to "Z")
2. Lowercase Latin characters (from "a" to "z")
3. Digits (from "0" to "9")
4. The underscore ("_")
5. The n-dash ("-")

This way, the first ID of 0th series will be `AAAAAAAAAAAAAAAAAAAAA` and the last one will be `---------------------`.


## API
### Issuers Classes
#### `PersistentSerialNanoIDsGenerator`

The abstract class intended to be extended and implemented the methods related to data storing.


##### Protected Fields
###### `reversedPositions`

<dl>

  <dt>Type</dt>
  <dd><code>Array</code></dd>

  <dt>Can be <code>undefined</code> or <code>null</code></dt>
  <dd>No</dd>

  <dt>Default Value</dt>
  <dd><code>[ "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A" ]</code></dd>

  <dt>Elements Type</dt>
  <dd><code>String</code></dd>

  <dt>Fixed Elements Count</dt>
  <dd><code>21</code></dd>

</dl>

Representing each character in reverse order of *next* Nano ID expected to be available for usage.

+ The reversed order has been selected to make the arithmetic operations easier.  
+ Mya be initialized via constructor, but if has not been initialized, will be 
  `[ "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A" ]` 
  (21 "A" character) as default.


###### `series`

<dl>

  <dt>Type</dt>
  <dd><code>Number</code></dd>

  <dt>Can be <code>undefined</code> or <code>null</code></dt>
  <dd>No</dd>

  <dt>Default Value</dt>
  <dd><code>0</code></dd>

  <dt>Number Set</dt>
  <dd><code>Natural Number or 0</code></dd>

</dl>

The series of _next_ Nano ID expected to be available for usage.


###### `mustInclude0thSeriesToIDs`

<dl>

  <dt>Type</dt>
  <dd><code>Boolean</code></dd>

  <dt>Can be <code>undefined</code> or <code>null</code></dt>
  <dd>No</dd>

  <dt>Default Value</dt>
  <dd><code>false</code></dd>
    
</dl>

Specifies must add the series prefix to IDs of 0th series or no.
The prefixed ID appears like <code>0~AAAAAAAAAAAAAAAAAAAAA</code>. 
Commonly series prefix is unwanted for 0th series, but note that once IDs of 0th series will exhausted the 
  characters count of ID will increase by 2.


###### `notSynchronizedIDsProhibitionOfWhichNoLongerRelevant`

<dl>

  <dt>Type</dt>
  <dd><code>Array</code></dd>

  <dt>Can be <code>undefined</code> or <code>null</code></dt>
  <dd>No</dd>

  <dt>Elements Type</dt>
  <dd><code>String</code></dd>

  <dt>Initial Value</dt>
  <dd><code>[]</code></dd>

</dl>

_Temporarily_ stores the IDs of **forbidden ones** group, herewith the ones which are less than current Nano ID.

As has been explained above, the Nano ID can be considered as a number of base 64 numeral system, thus using this 
  feature the IDs can be issued in fixed order, not randomly.
The storing of forbidden IDs (if any) is crucial, but once the ID greater than forbidden one will be issued, no need
  to store this forbidden ID anymore.
For the optimization purposes, issuing new IDs, `PersistentSerialNanoIDsGenerator` detects such not actually forbidden 
  IDs and running `deleteForbiddenIDs` method (which is abstract thus must be implemented).


##### Constructor

Has `protected` modifier.
Accepts the single parameter, of object type and the following schema.

<dl>

  <dt><code>initialPositions</code></dt>
  <dd>
    <dl>
      <dt>Type</dt>
      <dd><code>Array</code></dd>
      <dt>Is Required</dt>
      <dd>No</dd>
      <dt>Elements Type</dt>
      <dd><code>String</code></dd>
      <dt>Fixed Elements Count</dt>
      <dd><code>21</code></dd>
      <dt>Description</dt>
      <dd>
        Representing each character of <i>next</i> Nano ID expected to be available for usage.
        <ul>
          <li>
            If not specified, then the IDs generating will start from <code>AAAAAAAAAAAAAAAAAAAAA</code> but if some
              IDs has been generated previosly, the value commonly stored in some data storage must be specified.
          </li>
          <li>
            Used to initialize the <a href="#reversedpositions"><code>initialPositions</code></a> class field but unlike 
              this field, the characters count in <code>initialPositions</code> is forward, not reversed. 
          </li>
        </ul>
      </dd> 
    </dl>
  </dd>

  <dt><code>initialSeries</code></dt>
  <dd>
    <dl>
      <dt>Type</dt>
      <dd><code>Number</code></dd>
      <dt>Default Value</dt>
      <dd><code>0</code></dd>
      <dt>Number Set</dt>
      <dd><code>Natural Number or 0</code></dd>
      <dt>Description</dt>
      <dd>
        The series of next Nano ID expected to be available for usage.
        <ul>
          <li>The initial series is <code>0</code> but the series prefix is not be added to generated ID as default.</li>
          <li>Corresponding to <a href="#series"><code>initialSeries</code></a> class field.</li>
        </ul>
      </dd> 
    </dl>
  </dd>

  <dt><code>mustInclude0thSeriesToIDs</code></dt>
  <dd>
    <dl>
      <dt>Type</dt>
      <dd><code>Boolean</code></dd>
      <dt>Default Value</dt>
      <dd><code>false</code></dd>
      <dt>Description</dt>
      <dd>
        Specifies must add the series prefix to IDs of 0th series or no (no by default).
        The prexied ID apeears like <code>0~AAAAAAAAAAAAAAAAAAAAA</code>. 
        Commonly series prefix is unwanted for 0th series, but note that once IDs of 0th series will exhaused the 
          characters count in ID will increase.
      </dd> 
    </dl>
  </dd>

</dl>

Here is how **PersistentSerialNanoIDsGenerator**'s constructor has been accessed in **IoredisSerialNanoIDsGenerator**,
  the inheritor of **PersistentSerialNanoIDsGenerator** from **@yamato-daiwa/serial-unique-identifiers-ioredis**, the
  related package:

```typescript
abstract class IoredisSerialNanoIDsGenerator extends PersistentSerialNanoIDsGenerator {

  protected readonly redisKeys: IoredisSerialNanoIDsGenerator.RedisKeys;

  protected readonly ioredisInstance: Redis;


  protected constructor(
    {
      ioredisInstance,
      redisKeys,
      ...options
    }:
        IoredisSerialNanoIDsGenerator.ConstructorParameter
  ) {
    super(options);
    this.ioredisInstance = ioredisInstance;
    this.redisKeys = redisKeys;
  }
  
  // ...
  
}

namespace IoredisSerialNanoIDsGenerator {

  export type ConstructorParameter =

      PersistentSerialNanoIDsGenerator.Options &

      Readonly<{
        ioredisInstance: Redis;
        redisKeys: RedisKeys;
      }>;

}
```

You can see that all options of **PersistentSerialNanoIDsGenerator** has been passed to its constructor as is,
  but **IoredisSerialNanoIDsGenerator** accepts 2 more Redis-specific options.


#### Abstract Methods

All abstract methods are related with data exchange with the data source like some kind of a database, so the 
  implementation will depend on the specific type of data source.

##### Public
###### `reportSuccessfulUsageOfIssuedIDs`

```
(targetIDs: ReadonlyArray<string>): Promise<void>
```

Intended to be implemented with deleting of IDs passed via the single parameter from the group of 
  **issued but has not been used yet** ones.

Here is how it has been done in **@yamato-daiwa/serial-unique-identifiers-ioredis**:

```typescript
import type Redis from "ioredis";
import { PersistentSerialNanoIDsGenerator } from "@yamato-daiwa/serial-unique-identifiers";


export abstract class IoredisSerialNanoIDsGenerator extends PersistentSerialNanoIDsGenerator {

  protected readonly redisKeys: IoredisSerialNanoIDsGenerator.RedisKeys;

  protected readonly ioredisInstance: Redis;

  // ...

  public async reportSuccessfulUsageOfIssuedIDs(targetIDs: ReadonlyArray<string>): Promise<void> {
    await this.ioredisInstance.srem(this.redisKeys.issuedButHasNotBeenUsedYetIDs, ...targetIDs);
  }

  // ...

}
```


###### `reportHasBecomeUnnecessaryIDs`

```
(targetIDs: ReadonlyArray<string>): Promise<void>
```

Intended to be implemented with adding of target IDs to the collection of **issued but has become unnecessary IDs** ones.

Here is how it has been done in **@yamato-daiwa/serial-unique-identifiers-ioredis**:

```typescript
import type Redis from "ioredis";
import { PersistentSerialNanoIDsGenerator } from "@yamato-daiwa/serial-unique-identifiers";


export abstract class IoredisSerialNanoIDsGenerator extends PersistentSerialNanoIDsGenerator {

  protected readonly redisKeys: IoredisSerialNanoIDsGenerator.RedisKeys;

  protected readonly ioredisInstance: Redis;

  // ...

  public async reportHasBecomeUnnecessaryIDs(targetIDs: ReadonlyArray<string>): Promise<void> {
    await this.ioredisInstance.sadd(this.redisKeys.issuedButHasBecomeUnnecessaryIDs, ...targetIDs);
  }

  // ...

}
```

###### `registerForbiddenIDs`

```
(targetIDs: ReadonlyArray<string>): Promise<void>
```

Intended to be implemented with the adding of target IDs to the collection of **forbidden** ones.

Here is how it has been done in **@yamato-daiwa/serial-unique-identifiers-ioredis**:

```typescript
import type Redis from "ioredis";
import { PersistentSerialNanoIDsGenerator } from "@yamato-daiwa/serial-unique-identifiers";


export abstract class IoredisSerialNanoIDsGenerator extends PersistentSerialNanoIDsGenerator {

  protected readonly redisKeys: IoredisSerialNanoIDsGenerator.RedisKeys;

  protected readonly ioredisInstance: Redis;

  // ...

  public async registerForbiddenIDs(targetIDs: ReadonlyArray<string>): Promise<void> {
    await this.ioredisInstance.sadd(this.redisKeys.forbiddenIDs, ...targetIDs);
  }

  // ...

}
```

Internally, this method will be invoked by `reportExternallyIssuedUsageOfIDs`, the non-abstract public method.


###### `isID_Forbidden`

```
(targetID: string): Promise<boolean>
```

Intended to be implemented with returning of the boolean value, the `true` one when target ID presents in the collection
  of the **forbidden** ones.

Here is how it has been done in **@yamato-daiwa/serial-unique-identifiers-ioredis**:

```typescript
import type Redis from "ioredis";
import { PersistentSerialNanoIDsGenerator } from "@yamato-daiwa/serial-unique-identifiers";


export abstract class IoredisSerialNanoIDsGenerator extends PersistentSerialNanoIDsGenerator {

  protected readonly redisKeys: IoredisSerialNanoIDsGenerator.RedisKeys;

  protected readonly ioredisInstance: Redis;

  // ...

  public async isID_Forbidden(targetID: string): Promise<boolean> {
    return await this.ioredisInstance.sismember(this.redisKeys.forbiddenIDs, targetID) === 1;
  }

  // ...

}
```

This method is being internally used by `issueID_FromReversedPositionsOnly`, the non-abstract protected method.


###### `deleteForbiddenIDs`

```
(targetIDs: ReadonlyArray<string>): Promise<void>
```

Intended to be implemented with removing of target IDs from the collection of **forbidden** ones.

Here is how it has been done in **@yamato-daiwa/serial-unique-identifiers-ioredis**:

```typescript
import type Redis from "ioredis";
import { PersistentSerialNanoIDsGenerator } from "@yamato-daiwa/serial-unique-identifiers";


export abstract class IoredisSerialNanoIDsGenerator extends PersistentSerialNanoIDsGenerator {

  protected readonly redisKeys: IoredisSerialNanoIDsGenerator.RedisKeys;

  protected readonly ioredisInstance: Redis;

  // ...

  public async deleteForbiddenIDs(targetIDs: ReadonlyArray<string>): Promise<void> {
    await this.ioredisInstance.srem(this.redisKeys.forbiddenIDs, ...targetIDs);
  }

  // ...

}
```

If the forbidden ID is smaller (see [the above explanation](#approach) about the numeric nature of the Nano ID) than 
  previously issued ones, then no need to store it anymore because the smaller ones will never be issued.

This method is being used internally for multiple times.


##### Protected

###### `removeThenGetIssuedButHasBecomeUnnecessaryIDs`

```
(maximalQuantity: number): Promise<Array<string>>
```

Intended to be implemented with the removing of the specified maximal number of IDs from the collection of 
  **issued but has become unnecessary** ones, herewith these IDs must be returned.
Certainly, this collection may not have request number ID (as a last resort not to have at all). 

Here is how it has been done in **@yamato-daiwa/serial-unique-identifiers-ioredis**:

```typescript
import type Redis from "ioredis";
import { PersistentSerialNanoIDsGenerator } from "@yamato-daiwa/serial-unique-identifiers";


export abstract class IoredisSerialNanoIDsGenerator extends PersistentSerialNanoIDsGenerator {

  protected readonly redisKeys: IoredisSerialNanoIDsGenerator.RedisKeys;

  protected readonly ioredisInstance: Redis;

  // ...

  protected async removeThenGetIssuedButHasBecomeUnnecessaryIDs(maximalQuantity: number): Promise<Array<string>> {
    return this.ioredisInstance.spop(this.redisKeys.issuedButHasBecomeUnnecessaryIDs, maximalQuantity);
  }

  // ...

}
```

This method is being used internally for multiple times.


###### `registerIssuedButNotUsedYetIDs`

```
(targetIDs: ReadonlyArray<string>): Promise<void>
```

Intended to be implemented with the adding of target IDs of the collection of **issued but has become unnecessary** ones.

Here is how it has been done in **@yamato-daiwa/serial-unique-identifiers-ioredis**:

```typescript
import type Redis from "ioredis";
import { PersistentSerialNanoIDsGenerator } from "@yamato-daiwa/serial-unique-identifiers";


export abstract class IoredisSerialNanoIDsGenerator extends PersistentSerialNanoIDsGenerator {

  protected readonly redisKeys: IoredisSerialNanoIDsGenerator.RedisKeys;

  protected readonly ioredisInstance: Redis;

  // ...

  protected async registerIssuedButNotUsedYetIDs(targetIDs: ReadonlyArray<string>): Promise<void> {
    await this.ioredisInstance.sadd(this.redisKeys.issuedButHasNotBeenUsedYetIDs, ...targetIDs);
  }

  // ...

}
```

This method is being used internally for multiple times.


###### `synchronizeReversedPositions`

```
(): Promise<void>
```

Intended to be implemented with saving of [`reversedPositions`](#reversedpositions)'f field value on the data storage.

Here is how it has been done in **@yamato-daiwa/serial-unique-identifiers-ioredis**:

```typescript
import type Redis from "ioredis";
import { PersistentSerialNanoIDsGenerator } from "@yamato-daiwa/serial-unique-identifiers";


export abstract class IoredisSerialNanoIDsGenerator extends PersistentSerialNanoIDsGenerator {

  protected readonly redisKeys: IoredisSerialNanoIDsGenerator.RedisKeys;

  protected readonly ioredisInstance: Redis;

  // ...

  protected async synchronizeReversedPositions(): Promise<void> {
    await this.ioredisInstance.set(this.redisKeys.reversedPositions, JSON.stringify(this.reversedPositions));
  }

  // ...

}
```

This method is being used internally for multiple times.


###### `synchronizeSeries`

```
(): Promise<void>
```

Intended to be implemented with saving of [`reversedPositions`](#reversedpositions)'f field value on the data storage.

Here is how it has been done in **@yamato-daiwa/serial-unique-identifiers-ioredis**:

```typescript
import type Redis from "ioredis";
import { PersistentSerialNanoIDsGenerator } from "@yamato-daiwa/serial-unique-identifiers";


export abstract class IoredisSerialNanoIDsGenerator extends PersistentSerialNanoIDsGenerator {

  protected readonly redisKeys: IoredisSerialNanoIDsGenerator.RedisKeys;

  protected readonly ioredisInstance: Redis;

  // ...

  protected async synchronizeSeries(): Promise<void> {
    await this.ioredisInstance.set(this.redisKeys.series, this.series);
  }

  // ...

}
```

This method is being used internally for multiple times.


#### Non-abstract Methods
##### Public
###### `generateOne`

```
(): Promise<string>
```

Generates a single ID.

First, if there is at least one ID among **issued but has become unnecessary** ones, this ID will be issued and 
  added to the group of **issued but has not been used yet** ones.
Otherwise, the ID corresponding to the current value of [`reversedPositions`](#reversedpositions)  will be issued
  (respecting the forbidden IDs if any).
Anyway, this operation will cause some data exchange with the implementation-dependent data source.
Some abstract methods will be used.


###### `generateMultipleOnes`

```
(count: number): Promise<Array<string>>
```

Generated the specified number of IDs. 

First, if there is at least one ID of **issued but has become unnecessary** ones, these IDs will be issued and 
  added to the group of **issued but has not been used yet** ones.
If it will not be enough, the remaining IDs will be issued based on the current value of 
  [`reversedPositions`](#reversedpositions) (respecting the forbidden IDs if any).
Anyway, this operation will cause some data exchange with the implementation-dependent data source.
Some abstract methods will be used.


> [!WARNING]
> The calling of `generateMultipleOnes` with `n` as the parameter's value is _not_ equivalent to calling of `generateOne`
>   method `n` times because `generateMultipleOnes` is the _optimized_ for multiple IDs case implementation.   
> It executes a minimal number of operations with the data source, and this number does _not_ depend on how many IDs 
>   are requested.


###### `reportExternallyIssuedUsageOfIDs`

```
(targetIDs: Array<string>): Promise<void>
```

Added the specified IDs to the group of **forbidden ones** if required (see details below to know
  when it is required).

Normally, it should be the single issuer of IDs (for each entity).
When it is such us, the IDs collision will unlikely to happen, so there is no need to use this method.
However, the violations of this rule by some users of this library is not under our control.
To prevent the IDs collision, the inheritor of `PersistentSerialNanoIDsGenerator` class must be notified about
  external issued of these IDs.

The optimized implementation of this method is not as easy as it seems.
Quite a lot of work must be done before invoke the [`registerForbiddenIDs`](#registerforbiddenids) abstract method
  actually saving data to the data source.
First, the passed parameter, the array of strings, may include the duplicates, so they should be eliminated, not saved
  to the data store as is.
Second, some elements may be less (see [the above explanation](#approach) about the numeric nature of the Nano ID) than 
  the ID corresponding to [`reversedPostions`](#reversedpositions) - no need to store such IDs because they will 
  not be issued (by `PersistentSerialNanoIDsGenerator`).


##### Protected Instance
###### `issueID_FromReversedPositionsOnly`

```
(compoundParameter: Readonly<{ mustSynchronizeData: boolean; }>): Promise<string>
```

According to its name, issuing the ID basing on the current value of `reversedPositions` field.
Respects forbidden IDs.
Basically, when the ID has been issued, the related data (positions, series, etc.) must be synchronized with the data
  store.
However, when the multiple ID is being issued, one synchronization per issued ID may cause a significant performance
  impact.
To avoid it, the synchronization should be executed when all IDs will be issued.
The data synchronization requirement must be specified via the single parameter.
To avoid the code like `PersistentSerialNanoIDsGenerator.issueID_FromReversedPositionsOnly(true)` with unclear
  meaning of the boolean parameter, this boolean parameter has been wrapped by the object.


##### Protected Static
###### `computeIncrementedPositionsAndSeriesWithoutCheckingForForbiddenIDs`

```
(reversedPositions: ReadonlyArray<string>, series: number): PersistentSerialNanoIDsGenerator.IncrementingResult
```

```typescirpt
export type IncrementingResult = Readonly<{
  updatedReversedPositions: Array<string>;
  updatedSeries: number;
}>;
```

Exactly to its name, computes incremented positions and series without checking for the forbidden IDs.

This method does not increment the positions and series, it is exactly computes what will be if to increment it.
The positions should not be directly incremented because it is required to respect the forbidden IDs and synchronize the
  data what will required the computing resources and asynchronicity.
The data synchronization must be executed only when the issued ID has been checked for the forbidden ID, but the
  data synchronization is outside of the responsibility of this synchronous method.


###### `generateID_BasedOnInMemoryDataOnly`

```
(
  reversedPositions: ReadonlyArray<string>,
  series: number,
  mustInclude0thSeriesToIDs: boolean
): string
```

The trivial method generating the ID basing on `reversedPositions`, `series` and `mustInclude0thSeriesToIDs`.
The values of the parameters are not always the even with instance fields, so the method has been made static.


###### `generateReversedPositionsForFirstID`

```
(): Array<string>
```

Just returns the new array of **21** elements of string type and with "A" value.
The returning of new object/array instead of storing it to the field is the standard way to create the independent
  objects/arrays instead of reusage of the same reference. 


#### `InMemorySerialNanoIDsGenerator`

The fully synchronous but _pared-down_ alternative to `PersistentSerialNanoIDsGenerator` indended to be used _only_ 
  in local development mode where the losing of the data (usually the sampple/dummy data) is acceptable.
It generates the IDs in same sequence as `PersistentSerialNanoIDsGenerator`, but does not store the data between the 
  application launches.


##### Protected Fields
###### `reversedPositions`

<dl>

  <dt>Type</dt>
  <dd><code>Array</code></dd>

  <dt>Can be <code>undefined</code> or <code>null</code></dt>
  <dd>No</dd>

  <dt>Default Value</dt>
  <dd><code>[ "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A" ]</code></dd>

  <dt>Elements Type</dt>
  <dd><code>String</code></dd>

  <dt>Fixed Elements Count</dt>
  <dd><code>21</code></dd>

</dl>

Representing each character in reverse order of *next* Nano ID expected to be available for usage.

+ The reversed order has been selected to make the arithmetic operations easier.  
+ Mya be initialized via constructor, but if has not been initialized, will be 
  `[ "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A", "A" ]` 
  (21 "A" character) as default.


###### `series`

<dl>

  <dt>Type</dt>
  <dd><code>Number</code></dd>

  <dt>Can be <code>undefined</code> or <code>null</code></dt>
  <dd>No</dd>

  <dt>Default Value</dt>
  <dd><code>0</code></dd>

  <dt>Number Set</dt>
  <dd><code>Natural Number or 0</code></dd>

</dl>

The series of _next_ Nano ID expected to be available for usage.


###### `mustInclude0thSeriesToIDs`

<dl>

  <dt>Type</dt>
  <dd><code>Boolean</code></dd>

  <dt>Can be <code>undefined</code> or <code>null</code></dt>
  <dd>No</dd>

  <dt>Default Value</dt>
  <dd><code>false</code></dd>
    
</dl>

Specifies must add the series prefix to IDs of 0th series or no.
The prefixed ID appears like <code>0~AAAAAAAAAAAAAAAAAAAAA</code>. 
Commonly series prefix is unwanted for 0th series, but note that once IDs of 0th series will exhausted the 
  characters count of ID will increase by 2.


###### `issuedButUsageNotConfirmedIDs`

<dl>

  <dt>Type</dt>
  <dd><code>Set</code></dd>

  <dt>Default Value</dt>
  <dd><code>new Set()</code></dd>

  <dt>Elements Type</dt>
  <dd><code>String</code></dd>

</dl>


The IDs of <b>issued but has not been used yet</b> ones group.
Rarely needed for the local development mode.


###### `issuedButHasBecomeUnnecessaryIDs`

<dl>

  <dt>Type</dt>
  <dd><code>Set</code></dd>

  <dt>Default Value</dt>
  <dd><code>new Set()</code></dd>

  <dt>Elements Type</dt>
  <dd><code>String</code></dd>

</dl>

The IDs of <b>issued but has become unnecessary</b> ones group.
Rarely needed for the local development mode.


###### `forbiddenIDs`

<dl>

  <dt>Type</dt>
  <dd><code>Set</code></dd>

  <dt>Default Value</dt>
  <dd><code>new Set()</code></dd>

  <dt>Elements Type</dt>
  <dd><code>String</code></dd>

</dl>

The IDs of <b>forbidden</b> ones group.
Rarely need for the local development mode.


##### Constructor

Has `protected` modifier.
Accepts the single parameter, of object type and the following schema.

<dl>

  <dt><code>initialPositions</code></dt>
  <dd>
    <dl>
      <dt>Type</dt>
      <dd><code>Array</code></dd>
      <dt>Is Required</dt>
      <dd>No</dd>
      <dt>Elements Type</dt>
      <dd><code>String</code></dd>
      <dt>Fixed Elements Count</dt>
      <dd><code>21</code></dd>
      <dt>Description</dt>
      <dd>
        Representing each character of <i>next</i> Nano ID expected to be available for usage.
        <ul>
          <li>
            If not specified, then the IDs generating will start from <code>AAAAAAAAAAAAAAAAAAAAA</code> but if some
              IDs has been generated previosly, the value commonly stored in some data storage must be specified.
          </li>
          <li>
            Used to initialize the <a href="#reversedpositions-1"><code>initialPositions</code></a> class field but unlike 
              this field, the characters count in <code>initialPositions</code> is forward, not reversed. 
          </li>
        </ul>
      </dd> 
    </dl>
  </dd>

  <dt><code>initialSeries</code></dt>
  <dd>
    <dl>
      <dt>Type</dt>
      <dd><code>Number</code></dd>
      <dt>Default Value</dt>
      <dd><code>0</code></dd>
      <dt>Number Set</dt>
      <dd><code>Natural Number or 0</code></dd>
      <dt>Description</dt>
      <dd>
        The series of next Nano ID expected to be available for usage.
        <ul>
          <li>The initial series is <code>0</code> but the series prefix is not be added to generated ID as default.</li>
          <li>Corresponding to <a href="#series-1"><code>initialSeries</code></a> class field.</li>
        </ul>
      </dd> 
    </dl>
  </dd>

  <dt><code>mustInclude0thSeriesToIDs</code></dt>
  <dd>
    <dl>
      <dt>Type</dt>
      <dd><code>Boolean</code></dd>
      <dt>Default Value</dt>
      <dd><code>false</code></dd>
      <dt>Description</dt>
      <dd>
        Specifies must add the series prefix to IDs of 0th series or no (no by default).
        The prexied ID apeears like <code>0~AAAAAAAAAAAAAAAAAAAAA</code>. 
        Commonly series prefix is unwanted for 0th series, but note that once IDs of 0th series will exhaused the 
          characters count in ID will increase.
      </dd> 
    </dl>
  </dd>

  <dt><code>issuedButUsageNotConfirmedIDs</code></dt>
  <dt>
   <dl>
      <dt>Type</dt>
      <dd><code>Set</code></dd>
      <dt>Is Required</dt>
      <dd>No</dd>
      <dt>Elements Type</dt>
      <dd><code>String</code></dd>
      <dt>Description</dt>
      <dd>
        The IDs of <b>issued but has not been used yet</b> ones group.        
        <ul>
          <li>Rarely needed for the local development mode.</li>
          <li>Corresponding to <a href="#issuedbutusagenotconfirmedids"><code>issuedButUsageNotConfirmedIDs</code></a> class field.</li>
        </ul>
      </dd> 
    </dl>
  </dt>

  <dt><code>issuedButHasBecomeUnnecessaryIDs</code></dt>
  <dt>
   <dl>
      <dt>Type</dt>
      <dd><code>Set</code></dd>
      <dt>Is Required</dt>
      <dd>No</dd>
      <dt>Elements Type</dt>
      <dd><code>String</code></dd>
      <dt>Description</dt>
      <dd>
        The IDs of <b>issued but has become unnecessary</b> ones group.
        <ul>
          <li>Rarely needed for the local development mode.</li>
          <li>Corresponding to <a href="#issuedbuthasbecomeunnecessaryids"><code>issuedButHasBecomeUnnecessaryIDs</code></a> class field.</li>
        </ul>
      </dd> 
    </dl>
  </dt>

  <dt><code>forbiddenIDs</code></dt>
  <dt>
   <dl>
      <dt>Type</dt>
      <dd><code>Set</code></dd>
      <dt>Is Required</dt>
      <dd>No</dd>
      <dt>Elements Type</dt>
      <dd><code>String</code></dd>
      <dt>Description</dt>
      <dd>
        The IDs of <b>forbidden</b> ones group.
        <ul>
          <li>Rarely needed for the local development mode.</li>
          <li>Corresponding to <a href="#forbiddenids"><code>forbiddenIDs</code></a> class field.</li>
        </ul>
      </dd> 
    </dl>
  </dt>

</dl>

[//]: # (TODOD Edit =============================================================================)

### Utils
#### `addEntityToDataSourceRespectingPossibleIDsConflictsEvenWithPersistentSerialNanoIDsGenerator` function

According to its long but exact, intended to be used when adding the entity to a data source (such a database)
  respecting possible IDs conflicts.

```
<BeforeEntityCreatingHookData extends object = ArbitraryObject>(
  {
    persistentSerialNanoIDsGenerator,
    onBeforeEntityCreating,
    entityCreatingOperation,
    rollingBackOfBeforeEntityCreatingActions,
    isIDsConflictError,
    maximalNumberOfIDsConflicts,
    maximalNumbersOfIDsConflictsReachedErrorThrower,
    throwerOfErrorsOtherThanIDs_Conflict
  }: Readonly<{
    persistentSerialNanoIDsGenerator: PersistentSerialNanoIDsGenerator;
    onBeforeEntityCreating?: (ID_ForNewEntity: string) => Promise<BeforeEntityCreatingHookData>;
    entityCreatingOperation:
        (ID_ForNewEntity: string, beforeEntityCreatingHookData: BeforeEntityCreatingHookData) => Promise<unknown>;
    rollingBackOfBeforeEntityCreatingActions?: (beforeEntityCreatingHookData: BeforeEntityCreatingHookData) => Promise<void>;
    isIDsConflictError: (error: unknown) => boolean;
    maximalNumberOfIDsConflicts: number;
    maximalNumbersOfIDsConflictsReachedErrorThrower?: () => never;
    throwerOfErrorsOtherThanIDs_Conflict?: (error: unknown, beforeEntityCreatingHookData: BeforeEntityCreatingHookData) => never;
  }>
): Promise<string> 
```

As been mentioned previously, usage of **PersistentSerialNanoIDsGenerator** can not prevent the manual adding of an 
  entity to a data source with ID which **PersistentSerialNanoIDsGenerator** still considering as unused one.
Although the "Single IDs issues per entity" pattern is recommended, we can not prevent from this rule being violated.

Basically, the adding of an entity to a data source is trivial (sometimes just one line of code), but what must be done
  if the IDs conflict will occur?
Of course, the reporting of this ID as used and issuing of new ID.
Theoretically the number of IDs conflicts can be arbitrary large, but if no conflicts limit has been set, the transaction
  will take too much time.

The flow becomes complicated if something depends on an issued ID.
For instance, what if some image file must be created when creating the new entity?
Basically, the entity will store some kind of reference to this image file (basically path), but if the entity creating 
  will be failed ...

You can implement everything of above yourself, but this function doing the routinea.

##### Parameter

Has object type with clear named options.

<dl>

  <dt><code>persistentSerialNanoIDsGenerator</code></dt>
  <dd>
    <dl>
      <dt>Type</dt>
      <dd><code>PersistentSerialNanoIDsGenerator</code></dd>
      <dt>Is Required</dt>
      <dd>Yes</dd>
      <dt>Description</dt>
      <dd>
        The inheritor of <code>PersistentSerialNanoIDsGenerator</code>.
        Will be used for the generating of ID and the reporting about its usage.
      </dd> 
    </dl>
  </dd>

  <dt><code>onBeforeEntityCreating</code></dt>
  <dd>
    <dl>
      <dt>Type</dt>
      <dd><code>Function</code></dd>
      <dt>Is Required</dt>
      <dd>No</dd>
      <dt>Signature</dt>
      <dd><code>(ID_ForNewEntity: string) => Promise&lt;BeforeEntityCreatingHookData&gt;</code></dd>
      <dt>Description</dt>
      <dd>
        You can do something between the ID has been issued and the entity has been created in data source.
        If you want to return something, then this value will be available in other functions.
        For example, you can create the file with name based on the issued ID and store this file in this function.
        Note that if the entitiy craeting operation will failed, you may need to rollback what you have done
          in <code>rollingBackOfBeforeEntityCreatingActions</code> function.
      </dd> 
    </dl>
  </dd>

</dl>
