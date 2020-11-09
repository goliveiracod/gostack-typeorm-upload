import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export default class CreateTransactions1604626792937
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'transactions',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'title',
          type: 'varchar',
        },
        {
          name: 'type',
          type: 'enum',
          enum: ['income', 'outcome'],
        },
        {
          name: 'value',
          type: 'decimal',
          precision: 10,
          scale: 2,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    });

    await queryRunner.createTable(table);

    await queryRunner.addColumn(
      table,
      new TableColumn({
        name: 'category_id',
        type: 'uuid',
        isNullable: true,
      }),
    );

    await queryRunner.createForeignKey(
      table,
      new TableForeignKey({
        columnNames: ['category_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'categories',
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('transactions');

    const { foreignKeys } = table as Table;

    const foreignKey = foreignKeys.find(
      fk => fk.columnNames.indexOf('category_id') !== -1,
    ) as TableForeignKey;

    await queryRunner.dropForeignKey('transactions', foreignKey);

    await queryRunner.dropColumn('transactions', 'category_id');

    await queryRunner.dropTable('transactions');
  }
}
