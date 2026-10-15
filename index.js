const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

const Car = sequelize.define('Car', {
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'cars',
  timestamps: false,
});

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Подключение к SQLite установлено');

    await Car.sync({ force: true });
    console.log('Таблица cars создана');

    const cars = await Car.bulkCreate([
      { brand: 'Toyota', model: 'Camry', year: 2022, price: 35000 },
      { brand: 'BMW', model: 'X5', year: 2023, price: 65000 },
      { brand: 'Tesla', model: 'Model 3', year: 2024, price: 45000 },
    ]);
    console.log(`Добавлено ${cars.length} машин`);

    console.log('\nСписок всех машин:');
    const allCars = await Car.findAll();

    allCars.forEach((car, index) => {
      console.log(
        `${index + 1}. [${car.id}] ${car.brand} ${car.model} (${car.year}) — $${car.price}`
      );
    });

    console.log('\nПервая машина (JSON):');
    console.log(JSON.stringify(allCars[0], null, 2));

  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await sequelize.close();
  }
}

main();