import type { Options as RetryAsPromisedOptions } from 'retry-as-promised';
import type { AbstractDialect } from './dialects/abstract';
import type { AbstractConnectionManager } from './dialects/abstract/connection-manager';
import type { AbstractDataType, DataType, DataTypeClassOrInstance } from './dialects/abstract/data-types.js';
import type { AbstractQueryInterface } from './dialects/abstract/query-interface';
import type { ColumnsDescription, CreateSchemaOptions } from './dialects/abstract/query-interface.types';
import type { DynamicSqlExpression } from './expression-builders/base-sql-expression.js';
import type { cast } from './expression-builders/cast.js';
import type { col } from './expression-builders/col.js';
import type { Fn, fn } from './expression-builders/fn.js';
import type { json } from './expression-builders/json.js';
import type { literal } from './expression-builders/literal.js';
import type { where } from './expression-builders/where.js';
import type {
  AttributeOptions,
  Attributes,
  ColumnReference,
  DropOptions,
  Hookable,
  Logging,
  Model,
  ModelAttributes,
  ModelOptions,
  ModelStatic,
  Poolable,
  Transactionable,
} from './model';
import type { ModelManager } from './model-manager';
import { SequelizeTypeScript } from './sequelize-typescript.js';
import type { SequelizeHooks } from './sequelize-typescript.js';
import type { RequiredBy } from './utils/types.js';
import type { AbstractQueryGenerator, DataTypes, ISOLATION_LEVELS, Op, QueryTypes, TRANSACTION_TYPES } from '.';

export type RetryOptions = RetryAsPromisedOptions;

/**
 * Additional options for table altering during sync
 */
export interface SyncAlterOptions {
  /**
   * Prevents any drop statements while altering a table when set to `false`
   */
  drop?: boolean;
}

/**
 * Sync Options
 */
export interface SyncOptions extends Logging, Hookable {
  /**
   * If force is true, each DAO will do DROP TABLE IF EXISTS ..., before it tries to create its own table
   */
  force?: boolean;

  /**
   * If alter is true, each DAO will do ALTER TABLE ... CHANGE ...
   * Alters tables to fit models. Provide an object for additional configuration. Not recommended for production use. If not further configured deletes data in columns that were removed or had their type changed in the model.
   */
  alter?: boolean | SyncAlterOptions;

  /**
   * Match a regex against the database name before syncing, a safety check for cases where force: true is
   * used in tests but not live code
   */
  match?: RegExp;

  /**
   * The schema that the tables should be created in. This can be overridden for each table in sequelize.define
   */
  schema?: string;

  /**
   * An optional parameter to specify the schema search_path (Postgres only)
   */
  searchPath?: string;
}

export interface DefaultSetOptions { }

/**
 * Connection Pool options.
 *
 * Used in {@link Options.pool}
 */
export interface PoolOptions {
  /**
   * Maximum number of connections in pool. Default is 5
   */
  max?: number;

  /**
   * Minimum number of connections in pool. Default is 0
   */
  min?: number;

  /**
   * The maximum time, in milliseconds, that a connection can be idle before being released
   */
  idle?: number;

  /**
   * The maximum time, in milliseconds, that pool will try to get connection before throwing error
   */
  acquire?: number;

  /**
   * The time interval, in milliseconds, after which sequelize-pool will remove idle connections.
   */
  evict?: number;

  /**
   * The number of times to use a connection before closing and replacing it.  Default is Infinity
   */
  maxUses?: number;

  /**
   * A function that validates a connection. Called with client. The default function checks that client is an
   * object, and that its state is not disconnected
   */
  validate?(client?: unknown): boolean;
}

export type NormalizedPoolOptions = Readonly<Required<PoolOptions>>;

export interface ConnectionOptions {
  host?: string;
  port?: string | number;
  username?: string;
  password?: string;
  database?: string;
  protocol?: string;
  ssl?: boolean;
  dialectOptions?: DialectOptions;
}

/**
 * Interface for replication Options in the sequelize constructor
 */
export interface ReplicationOptions {
  read: Array<ConnectionOptions | string>;

  write: ConnectionOptions | string;
}

export interface NormalizedReplicationOptions {
  read: ConnectionOptions[];

  write: ConnectionOptions;
}

/**
 * Final config options generated by sequelize.
 */
export interface Config {
  readonly database: string;
  readonly dialectModule?: object;
  readonly host?: string;
  readonly port: number;
  readonly username: string;
  readonly password: string | null;
  readonly pool: NormalizedPoolOptions;
  readonly protocol: 'tcp';
  readonly native: boolean;
  readonly ssl: boolean;
  readonly replication: NormalizedReplicationOptions;
  readonly dialectModulePath: null | string;
  readonly keepDefaultTimezone?: boolean;
  readonly dialectOptions: Readonly<DialectOptions>;
}

export type Dialect = 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'ibmi';

/**
 * Options for the constructor of the {@link Sequelize} main class.
 */
export interface Options extends Logging {
  /**
   * The dialect of the database you are connecting to. One of mysql, postgres, sqlite, mariadb and mssql.
   *
   * @default 'mysql'
   */
  dialect?: Dialect;

  /**
   * If specified, will use the provided module as the dialect.
   *
   * @example
   * `dialectModule: require('@myorg/tedious'),`
   */
  dialectModule?: object;

  /**
   * If specified, load the dialect library from this path. For example, if you want to use pg.js instead of
   * pg when connecting to a pg database, you should specify 'pg.js' here
   */
  dialectModulePath?: string;

  /**
   * An object of additional options, which are passed directly to the connection library
   */
  dialectOptions?: DialectOptions;

  /**
   * Only used by sqlite.
   *
   * @default ':memory:'
   */
  storage?: string;

  /**
   * The name of the database
   */
  database?: string;

  /**
   * The username which is used to authenticate against the database.
   */
  username?: string;

  /**
   * The password which is used to authenticate against the database.
   */
  password?: string;

  /**
   * The host of the relational database.
   *
   * @default 'localhost'
   */
  host?: string;

  /**
   * The port of the relational database.
   */
  port?: number | string;

  /**
   * A flag that defines if is used SSL.
   */
  ssl?: boolean;

  /**
   * The protocol of the relational database.
   *
   * @default 'tcp'
   */
  protocol?: string;

  /**
   * The version of the Database Sequelize will connect to.
   * If unspecified, or set to 0, Sequelize will retrieve it during its first connection to the Database.
   */
  databaseVersion?: string | number;

  /**
   * Default options for model definitions. See Model.init.
   */
  define?: Omit<ModelOptions, 'name' | 'modelName' | 'tableName'>;

  /**
   * Default options for sequelize.query
   */
  query?: QueryOptions;

  /**
   * Default options for sequelize.set
   */
  set?: DefaultSetOptions;

  /**
   * Default options for sequelize.sync
   */
  sync?: SyncOptions;

  /**
   * The timezone used when converting a date from the database into a JavaScript date. The timezone is also
   * used to SET TIMEZONE when connecting to the server, to ensure that the result of NOW, CURRENT_TIMESTAMP
   * and other time related functions have in the right timezone. For best cross platform performance use the
   * format
   * +/-HH:MM. Will also accept string versions of timezones supported by Intl.Locale (e.g. 'America/Los_Angeles');
   * this is useful to capture daylight savings time changes.
   *
   * @default '+00:00'
   */
  timezone?: string;

  /**
   * A flag that defines if the default timezone is used to convert dates from the database.
   *
   * @default false
   */
  keepDefaultTimezone?: boolean;

  /**
   * A flag that defines if null values should be passed to SQL queries or not.
   *
   * @default false
   */
  omitNull?: boolean;

  // TODO: https://github.com/sequelize/sequelize/issues/14298
  //  Model.init should be able to omit the "sequelize" parameter and only be initialized once passed to a Sequelize instance
  //  using this option.
  //  Association definition methods should be able to be used on not-yet-initialized models, and be registered once the
  //  Sequelize constructor inits.
  /**
   * A list of models to load and init.
   *
   * This option is only useful if you created your models using decorators.
   * Models created using {@link Model.init} or {@link Sequelize#define} don't need to be specified in this option.
   *
   * Use {@link importModels} to load models dynamically:
   *
   * @example
   * ```ts
   * import { User } from './models/user.js';
   *
   * new Sequelize({
   *   models: [User],
   * });
   * ```
   *
   * @example
   * ```ts
   * new Sequelize({
   *   models: await importModels(__dirname + '/*.model.ts'),
   * });
   * ```
   */
  models?: ModelStatic[];

  /**
   * A flag that defines if native library shall be used or not. Currently only has an effect for postgres
   *
   * @default false
   */
  native?: boolean;

  /**
   * Use read / write replication. To enable replication, pass an object, with two properties, read and write.
   * Write should be an object (a single server for handling writes), and read an array of object (several
   * servers to handle reads). Each read/write server can have the following properties: `host`, `port`,
   * `username`, `password`, `database`.  Connection strings can be used instead of objects.
   *
   * @default false
   */
  replication?: ReplicationOptions | false | null | undefined;

  /**
   * Connection pool options
   */
  pool?: PoolOptions;

  // TODO [>7]: remove this option
  /**
   * Set to `false` to make table names and attributes case-insensitive on Postgres and skip double quoting of
   * them.
   *
   * @default true
   */
  quoteIdentifiers?: boolean;

  /**
   * Set the default transaction isolation level. See `Sequelize.Transaction.ISOLATION_LEVELS` for possible
   * options.
   *
   * @default 'REPEATABLE_READ'
   */
  isolationLevel?: ISOLATION_LEVELS;

  /**
   * Set the default transaction type. See Sequelize.Transaction.TYPES for possible options. Sqlite only.
   *
   * @default 'DEFERRED'
   */
  transactionType?: TRANSACTION_TYPES;

  /**
   * Disable built in type validators on insert and update, e.g. don't validate that arguments passed to integer
   * fields are integer-like.
   *
   * @default false
   */
  noTypeValidation?: boolean;

  /**
   * The PostgreSQL `standard_conforming_strings` session parameter. Set to `false` to not set the option.
   * WARNING: Setting this to false may expose vulnerabilities and is not recommended!
   *
   * @default true
   */
  standardConformingStrings?: boolean;

  /**
   * The PostgreSQL `client_min_messages` session parameter.
   * Set to `false` to not override the database's default.
   *
   * Deprecated in v7, please use the sequelize option "dialectOptions.clientMinMessages" instead
   *
   * @deprecated
   * @default 'warning'
   */
  clientMinMessages?: string | boolean;

  /**
   * Sets global permanent hooks.
   */
  hooks?: Partial<SequelizeHooks>;

  /**
   * Set to `true` to automatically minify aliases generated by sequelize.
   * Mostly useful to circumvent the POSTGRES alias limit of 64 characters.
   *
   * @default false
   */
  minifyAliases?: boolean;

  /**
   * Set to `true` to show bind parameters in log.
   *
   * @default false
   */
  logQueryParameters?: boolean;

  retry?: RetryOptions;

  /**
   * If defined the connection will use the provided schema instead of the default ("public").
   */
  schema?: string;

  /**
   * SQLite only. If set to false, foreign keys will not be enforced by SQLite.
   *
   * @default true
   */
  // TODO: move to dialectOptions, rename to noForeignKeyEnforcement, and add integration tests with
  //  query-interface methods that temporarily disable foreign keys.
  foreignKeys?: boolean;

  /**
   * Disable the use of AsyncLocalStorage to automatically pass transactions started by {@link Sequelize#transaction}.
   * You will need to pass transactions around manually if you disable this.
   */
  disableClsTransactions?: boolean;
}

export interface NormalizedOptions extends RequiredBy<Options, 'transactionType' | 'isolationLevel' | 'noTypeValidation' | 'dialectOptions' | 'dialect' | 'timezone' | 'disableClsTransactions'> {
  readonly replication: NormalizedReplicationOptions;
}

export interface DialectOptions {
  [key: string]: any;
  account?: string;
  role?: string;
  warehouse?: string;
  schema?: string;
  odbcConnectionString?: string;
  charset?: string;
  timeout?: number;
  options?: string | Record<string, unknown>;
}

export interface SetSessionVariablesOptions extends Omit<QueryOptions, 'raw' | 'plain' | 'type'> { }

export type BindOrReplacements = { [key: string]: unknown } | unknown[];
type FieldMap = { [key: string]: string };

/**
 * Options for {@link Sequelize#queryRaw}.
 */
export interface QueryRawOptions extends Logging, Transactionable, Poolable {
  /**
   * If true, sequelize will not try to format the results of the query, or build an instance of a model from
   * the result
   */
  raw?: boolean;

  /**
   * The type of query you are executing. The query type affects how results are formatted before they are
   * passed back. The type is a string, but `Sequelize.QueryTypes` is provided as convenience shortcuts.
   */
  type?: string;

  /**
   * If true, transforms objects with `.` separated property names into nested objects using
   * [dottie.js](https://github.com/mickhansen/dottie.js). For example `{ 'user.username': 'john' }` becomes
   * `{ user: { username: 'john' }}`. When `nest` is true, the query type is assumed to be `'SELECT'`,
   * unless otherwise specified
   *
   * @default false
   */
  nest?: boolean;

  /**
   * Sets the query type to `SELECT` and return a single row
   */
  plain?: boolean;

  /**
   * Either an object of named parameter bindings in the format `$param` or an array of unnamed
   * values to bind to `$1`, `$2`, etc in your SQL.
   */
  bind?: BindOrReplacements;

  /**
   * A sequelize instance used to build the return instance
   */
  instance?: Model;

  /**
   * Map returned fields to model's fields if `options.model` or `options.instance` is present.
   * Mapping will occur before building the model instance.
   */
  mapToModel?: boolean;

  retry?: RetryOptions;

  /**
   * Map returned fields to arbitrary names for SELECT query type if `options.fieldMaps` is present.
   */
  fieldMap?: FieldMap;
}

export interface QueryRawOptionsWithType<T extends QueryTypes> extends QueryRawOptions {
  /**
   * The type of query you are executing. The query type affects how results are formatted before they are
   * passed back. The type is a string, but `Sequelize.QueryTypes` is provided as convenience shortcuts.
   */
  type: T;
}

export interface QueryRawOptionsWithModel<M extends Model> extends QueryRawOptions {
  /**
   * A sequelize model used to build the returned model instances (used to be called callee)
   */
  model: ModelStatic<M>;
}

/**
 * Options for {@link Sequelize#query}.
 */
export interface QueryOptions extends QueryRawOptions {
  /**
   * Either an object of named parameter replacements in the format `:param` or an array of unnamed
   * replacements to replace `?` in your SQL.
   */
  replacements?: BindOrReplacements;
}

export interface QueryOptionsWithType<T extends QueryTypes> extends QueryOptions {
  /**
   * The type of query you are executing. The query type affects how results are formatted before they are
   * passed back. The type is a string, but `Sequelize.QueryTypes` is provided as convenience shortcuts.
   */
  type: T;
}

export interface QueryOptionsWithModel<M extends Model> extends QueryOptions {
  /**
   * A sequelize model used to build the returned model instances (used to be called callee)
   */
  model: ModelStatic<M>;
}

/**
 * This is the main class, the entry point to sequelize. To use it, you just need to
 * import sequelize:
 *
 * ```ts
 * import { Sequelize } from '@sequelize/core';
 * ```
 *
 * In addition to sequelize, the connection library for the dialect you want to use
 * should also be installed in your project. You don't need to import it however, as
 * sequelize will take care of that.
 */
export class Sequelize extends SequelizeTypeScript {

  // -------------------- Utilities ------------------------------------------------------------------------

  /**
   * Creates a object representing a database function. This can be used in search queries, both in where and
   * order parts, and as default values in column definitions. If you want to refer to columns in your
   * function, you should use `sequelize.col`, so that the columns are properly interpreted as columns and
   * not a strings.
   *
   * Convert a user's username to upper case
   * ```ts
   * instance.update({
   *   username: fn('upper', col('username'))
   * })
   * ```
   *
   * @param fn The function you want to call
   * @param args All further arguments will be passed as arguments to the function
   *
   * @deprecated use top level {@link fn} instead
   * @hidden
   */
  static fn: typeof fn;
  /**
   * @deprecated use top level {@link fn} instead
   * @hidden
   */
  fn: typeof fn;

  /**
   * Creates a object representing a column in the DB. This is often useful in conjunction with
   * `sequelize.fn`, since raw string arguments to fn will be escaped.
   *
   * @param col The name of the column
   *
   * @deprecated use top level {@link col} instead
   * @hidden
   */
  static col: typeof col;
  /**
   * @deprecated use top level {@link col} instead
   * @hidden
   */
  col: typeof col;

  /**
   * Creates a object representing a call to the cast function.
   *
   * @param val The value to cast
   * @param type The type to cast it to
   *
   * @deprecated use top level {@link cast} instead
   * @hidden
   */
  static cast: typeof cast;
  /**
   * @deprecated use top level {@link cast} instead
   * @hidden
   */
  cast: typeof cast;

  /**
   * Creates a object representing a literal, i.e. something that will not be escaped.
   *
   * @param val
   *
   * @deprecated use top level {@link literal} instead
   * @hidden
   */
  static literal: typeof literal;
  /**
   * @deprecated use top level {@link literal} instead
   * @hidden
   */
  literal: typeof literal;

  /**
   * An AND query
   *
   * @param args Each argument will be joined by AND
   *
   * @deprecated use top level {@link and} instead
   * @hidden
   */
  static and: typeof and;
  /**
   * @deprecated use top level {@link and} instead
   * @hidden
   */
  and: typeof and;

  /**
   * An OR query
   *
   * @param args Each argument will be joined by OR
   *
   * @deprecated use top level {@link or} instead
   * @hidden
   */
  static or: typeof or;

  /**
   * @deprecated use top level {@link or} instead
   * @hidden
   */
  or: typeof or;

  /**
   * Creates an object representing nested where conditions for postgres's json data-type.
   *
   * @param conditionsOrPath A hash containing strings/numbers or other nested hash, a string using dot
   *   notation or a string using postgres json syntax.
   * @param value An optional value to compare against.
   *   Produces a string of the form "&lt;json path&gt; = '&lt;value&gt;'"`.
   *
   * @deprecated use top level {@link json} instead
   * @hidden
   */
  static json: typeof json;
  /**
   * @deprecated use top level {@link json} instead
   * @hidden
   */
  json: typeof json;

  /**
   * A way of specifying attr = condition.
   *
   * The attr can either be an object taken from `Model.rawAttributes` (for example `Model.rawAttributes.id`
   * or
   * `Model.rawAttributes.name`). The attribute should be defined in your model definition. The attribute can
   * also be an object from one of the sequelize utility functions (`sequelize.fn`, `sequelize.col` etc.)
   *
   * For string attributes, use the regular `{ where: { attr: something }}` syntax. If you don't want your
   * string to be escaped, use `sequelize.literal`.
   *
   * @param attr The attribute, which can be either an attribute object from `Model.rawAttributes` or a
   *   sequelize object, for example an instance of `sequelize.fn`. For simple string attributes, use the
   *   POJO syntax
   * @param comparator Comparator
   * @param logic The condition. Can be both a simply type, or a further condition (`.or`, `.and`, `.literal`
   *   etc.)
   *
   * @deprecated use top level {@link where} instead
   * @hidden
   */
  static where: typeof where;
  /**
   * @deprecated use top level {@link where} instead
   * @hidden
   */
  where: typeof where;

  /**
   * @deprecated use top level {@link Op} instead
   * @hidden
   */
  static Op: typeof Op;

  /**
   * @deprecated use top level {@link DataTypes} instead
   * @hidden
   */
  static DataTypes: typeof DataTypes;

  /**
   * A reference to Sequelize constructor from sequelize. Useful for accessing DataTypes, Errors etc.
   */
  Sequelize: typeof Sequelize;

  /**
   * Final config that is used by sequelize.
   */
  readonly config: Config;

  readonly options: NormalizedOptions;

  readonly dialect: AbstractDialect;

  readonly modelManager: ModelManager;

  readonly connectionManager: AbstractConnectionManager;

  /**
   * Dictionary of all models linked with this instance.
   */
  models: {
    [key: string]: ModelStatic,
  };

  /**
   * Instantiate sequelize with name of database, username and password
   *
   * #### Example usage
   *
   * ```javascript
   * // without password and options
   * const sequelize = new Sequelize('database', 'username')
   *
   * // without options
   * const sequelize = new Sequelize('database', 'username', 'password')
   *
   * // without password / with blank password
   * const sequelize = new Sequelize('database', 'username', null, {})
   *
   * // with password and options
   * const sequelize = new Sequelize('my_database', 'john', 'doe', {})
   *
   * // with uri (see below)
   * const sequelize = new Sequelize('mysql://localhost:3306/database', {})
   * ```
   *
   * @param database The name of the database
   * @param username The username which is used to authenticate against the
   *   database.
   * @param password The password which is used to authenticate against the
   *   database.
   * @param options An object with options.
   */
  constructor(database: string, username: string, password?: string, options?: Options);
  constructor(database: string, username: string, options?: Options);
  constructor(options?: Options);

  /**
   * Instantiate sequelize with an URI
   *
   * @param uri A full database URI
   * @param options See above for possible options
   */
  constructor(uri: string, options?: Options);

  /**
   * Returns the specified dialect.
   */
  getDialect(): string;

  /**
   * Returns the database name.
   */

  getDatabaseName(): string;

  /**
   * Returns the dialect-dependant QueryInterface instance.
   */
  getQueryInterface(): AbstractQueryInterface;

  /**
   * The QueryInterface instance, dialect dependant.
   */
  queryInterface: AbstractQueryInterface;

  /**
   * The QueryGenerator instance, dialect dependant.
   */
  queryGenerator: AbstractQueryGenerator;

  /**
   * Define a new model, representing a table in the DB.
   *
   * The table columns are defined by the hash that is given as the second argument. Each attribute of the
   * hash
   * represents a column. A short table definition might look like this:
   *
   * ```js
   * class MyModel extends Model {}
   * MyModel.init({
   *   columnA: {
   *     type: DataTypes.BOOLEAN,
   *     validate: {
   *       is: ["[a-z]",'i'],    // will only allow letters
   *       max: 23,          // only allow values <= 23
   *       isIn: {
   *       args: [['en', 'zh']],
   *       msg: "Must be English or Chinese"
   *       }
   *     },
   *     field: 'column_a'
   *     // Other attributes here
   *   },
   *   columnB: DataTypes.STRING,
   *   columnC: 'MY VERY OWN COLUMN TYPE'
   * }, { sequelize })
   *
   * sequelize.models.modelName // The model will now be available in models under the name given to define
   * ```
   *
   * As shown above, column definitions can be either strings, a reference to one of the datatypes that are
   * predefined on the Sequelize constructor, or an object that allows you to specify both the type of the
   * column, and other attributes such as default values, foreign key constraints and custom setters and
   * getters.
   *
   * For a list of possible data types, see
   * https://sequelize.org/docs/v7/other-topics/other-data-types
   *
   * For more about getters and setters, see
   * https://sequelize.org/docs/v7/core-concepts/getters-setters-virtuals/
   *
   * For more about instance and class methods, see
   * https://sequelize.org/docs/v7/core-concepts/model-basics/#taking-advantage-of-models-being-classes
   *
   * For more about validation, see
   * https://sequelize.org/docs/v7/core-concepts/validations-and-constraints/
   *
   * @param modelName  The name of the model. The model will be stored in `sequelize.models` under this name
   * @param attributes An object, where each attribute is a column of the table. Each column can be either a
   *           DataType, a string or a type-description object, with the properties described below:
   * @param options  These options are merged with the default define options provided to the Sequelize
   *           constructor
   */
  define<M extends Model, TAttributes = Attributes<M>>(
    modelName: string,
    attributes?: ModelAttributes<M, TAttributes>,
    options?: ModelOptions<M>
  ): ModelStatic<M>;

  /**
   * Fetch a Model which is already defined
   *
   * @param modelName The name of a model defined with Sequelize.define
   */
  model<M extends Model = Model>(modelName: string): ModelStatic<M>;

  /**
   * Checks whether a model with the given name is defined
   *
   * @param modelName The name of a model defined with Sequelize.define
   */
  isDefined(modelName: string): boolean;

  /**
   * Execute a query on the DB, optionally bypassing all the Sequelize goodness.
   *
   * By default, the function will return two arguments: an array of results, and a metadata object,
   * containing number of affected rows etc. Use `const [results, meta] = await ...` to access the results.
   *
   * If you are running a type of query where you don't need the metadata, for example a `SELECT` query, you
   * can pass in a query type to make sequelize format the results:
   *
   * ```js
   * const [results, metadata] = await sequelize.query('SELECT...'); // Raw query - use array destructuring
   *
   * const results = await sequelize.query('SELECT...', { type: sequelize.QueryTypes.SELECT }); // SELECT query - no destructuring
   * ```
   *
   * @param sql
   * @param options Query options
   */
  /* eslint-disable max-len -- these signatures are more readable if they are all aligned */
  query(sql: string | { query: string, values: unknown[] }, options: QueryOptionsWithType<QueryTypes.UPDATE>): Promise<[undefined, number]>;
  query(sql: string | { query: string, values: unknown[] }, options: QueryOptionsWithType<QueryTypes.BULKUPDATE>): Promise<number>;
  query(sql: string | { query: string, values: unknown[] }, options: QueryOptionsWithType<QueryTypes.INSERT>): Promise<[number, number]>;
  query(sql: string | { query: string, values: unknown[] }, options: QueryOptionsWithType<QueryTypes.UPSERT>): Promise<number>;
  query(sql: string | { query: string, values: unknown[] }, options: QueryOptionsWithType<QueryTypes.DELETE>): Promise<void>;
  query(sql: string | { query: string, values: unknown[] }, options: QueryOptionsWithType<QueryTypes.BULKDELETE>): Promise<number>;
  query(sql: string | { query: string, values: unknown[] }, options: QueryOptionsWithType<QueryTypes.SHOWTABLES>): Promise<string[]>;
  query(sql: string | { query: string, values: unknown[] }, options: QueryOptionsWithType<QueryTypes.DESCRIBE>): Promise<ColumnsDescription>;
  query<M extends Model>(sql: string | { query: string, values: unknown[] }, options: QueryOptionsWithModel<M> & { plain: true }): Promise<M | null>;
  query<M extends Model>(sql: string | { query: string, values: unknown[] }, options: QueryOptionsWithModel<M>): Promise<M[]>;
  query<T extends object>(sql: string | { query: string, values: unknown[] }, options: QueryOptionsWithType<QueryTypes.SELECT> & { plain: true }): Promise<T | null>;
  query<T extends object>(sql: string | { query: string, values: unknown[] }, options: QueryOptionsWithType<QueryTypes.SELECT>): Promise<T[]>;
  query(sql: string | { query: string, values: unknown[] }, options: (QueryOptions | QueryOptionsWithType<QueryTypes.RAW>) & { plain: true }): Promise<{ [key: string]: unknown } | null>;
  query(sql: string | { query: string, values: unknown[] }, options?: QueryOptions | QueryOptionsWithType<QueryTypes.RAW>): Promise<[unknown[], unknown]>;

  /**
   * Works like {@link Sequelize#query}, but does not inline replacements. Only bind parameters are supported.
   *
   * @param sql The SQL to execute
   * @param options The options for the query. See {@link QueryRawOptions} for details.
   */
  queryRaw(sql: string | { query: string, values: unknown[] }, options: QueryRawOptionsWithType<QueryTypes.UPDATE>): Promise<[undefined, number]>;
  queryRaw(sql: string | { query: string, values: unknown[] }, options: QueryRawOptionsWithType<QueryTypes.BULKUPDATE>): Promise<number>;
  queryRaw(sql: string | { query: string, values: unknown[] }, options: QueryRawOptionsWithType<QueryTypes.INSERT>): Promise<[number, number]>;
  queryRaw(sql: string | { query: string, values: unknown[] }, options: QueryRawOptionsWithType<QueryTypes.UPSERT>): Promise<number>;
  queryRaw(sql: string | { query: string, values: unknown[] }, options: QueryRawOptionsWithType<QueryTypes.DELETE>): Promise<void>;
  queryRaw(sql: string | { query: string, values: unknown[] }, options: QueryRawOptionsWithType<QueryTypes.BULKDELETE>): Promise<number>;
  queryRaw(sql: string | { query: string, values: unknown[] }, options: QueryRawOptionsWithType<QueryTypes.SHOWTABLES>): Promise<string[]>;
  queryRaw(sql: string | { query: string, values: unknown[] }, options: QueryRawOptionsWithType<QueryTypes.DESCRIBE>): Promise<ColumnsDescription>;
  queryRaw<M extends Model>(sql: string | { query: string, values: unknown[] }, options: QueryRawOptionsWithModel<M> & { plain: true }): Promise<M | null>;
  queryRaw<M extends Model>(sql: string | { query: string, values: unknown[] }, options: QueryRawOptionsWithModel<M>): Promise<M[]>;
  queryRaw<T extends object>(sql: string | { query: string, values: unknown[] }, options: QueryRawOptionsWithType<QueryTypes.SELECT> & { plain: true }): Promise<T | null>;
  queryRaw<T extends object>(sql: string | { query: string, values: unknown[] }, options: QueryRawOptionsWithType<QueryTypes.SELECT>): Promise<T[]>;
  queryRaw(sql: string | { query: string, values: unknown[] }, options: (QueryRawOptions | QueryRawOptionsWithType<QueryTypes.RAW>) & { plain: true }): Promise<{ [key: string]: unknown } | null>;
  queryRaw(sql: string | { query: string, values: unknown[] }, options?: QueryRawOptions | QueryRawOptionsWithType<QueryTypes.RAW>): Promise<[unknown[], unknown]>;
  /* eslint-enable max-len */

  /**
   * Get the fn for random based on the dialect
   */
  random(): Fn;

  /**
   * Execute a query which would set an environment or user variable. The variables are set per connection,
   * so this function needs a transaction.
   *
   * Only works for MySQL.
   *
   * @param variables object with multiple variables.
   * @param options Query options.
   */
  setSessionVariables(variables: object, options?: SetSessionVariablesOptions): Promise<unknown>;

  /**
   * Escape value.
   *
   * @param value Value that needs to be escaped
   */
  escape(value: string | number | Date): string;

  /**
   * Create a new database schema.
   *
   * Note,that this is a schema in the
   * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this command will do nothing.
   *
   * @param schema Name of the schema
   * @param options Options supplied
   */
  createSchema(schema: string, options?: CreateSchemaOptions): Promise<void>;

  /**
   * Show all defined schemas
   *
   * Note,that this is a schema in the
   * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this will show all tables.
   *
   * @param options Options supplied
   */
  showAllSchemas(options?: Logging): Promise<object[]>;

  /**
   * Drop a single schema
   *
   * Note,that this is a schema in the
   * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this drop a table matching the schema name
   *
   * @param schema Name of the schema
   * @param options Options supplied
   */
  dropSchema(schema: string, options?: Logging): Promise<unknown[]>;

  /**
   * Drop all schemas
   *
   * Note,that this is a schema in the
   * [postgres sense of the word](http://www.postgresql.org/docs/9.1/static/ddl-schemas.html),
   * not a database table. In mysql and sqlite, this is the equivalent of drop all tables.
   *
   * @param options Options supplied
   */
  dropAllSchemas(options?: Logging): Promise<unknown[]>;

  /**
   * Sync all defined models to the DB.
   *
   * @param options Sync Options
   */
  sync(options?: SyncOptions): Promise<this>;

  /**
   * Drop all tables defined through this sequelize instance. This is done by calling Model.drop on each model
   *
   * @param options The options passed to each call to Model.drop
   */
  drop(options?: DropOptions): Promise<unknown[]>;

  /**
   * Test the connection by trying to authenticate
   *
   * @param options Query Options for authentication
   */
  authenticate(options?: QueryOptions): Promise<void>;
  validate(options?: QueryOptions): Promise<void>;

  /**
   * Close all connections used by this sequelize instance, and free all references so the instance can be
   * garbage collected.
   *
   * Normally this is done on process exit, so you only need to call this method if you are creating multiple
   * instances, and want to garbage collect some of them.
   */
  close(): Promise<void>;

  normalizeAttribute<M extends Model = Model>(attribute: AttributeOptions<M> | DataType): AttributeOptions<M>;

  normalizeDataType(Type: string): string;
  normalizeDataType(Type: DataTypeClassOrInstance): AbstractDataType<any>;
  normalizeDataType(Type: string | DataTypeClassOrInstance): string | AbstractDataType<any>;

  /**
   * Fetches the database version
   */
  fetchDatabaseVersion(options?: QueryRawOptions): Promise<string>;

  /**
   * Returns the database version
   */
  getDatabaseVersion(): string;

  /**
   * Returns the installed version of Sequelize
   */
  static get version(): string;
}

// Utilities

/**
 * An AND query
 *
 * @param args Each argument will be joined by AND
 */
export function and<T extends any[]>(...args: T): { [Op.and]: T };

/**
 * An OR query
 *
 * @param args Each argument will be joined by OR
 */
export function or<T extends any[]>(...args: T): { [Op.or]: T };

export type Expression = ColumnReference | DynamicSqlExpression | unknown;
