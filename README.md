<p align="center">
  <a>
    <img alt="preview" src="https://i.imgur.com/wkgf1TH.png" width="100%">
  </a>
</p>

<p align='center'>
  <img alt='License' src='https://img.shields.io/badge/license-mit-1C1E26?style=for-the-badge&labelColor=1C1E26&color=d58453&' />
  <img alt='version' src='https://img.shields.io/badge/version-1.0-1C1E26?style=for-the-badge&labelColor=1C1E26&color=d58453&' />
</p>


## 📦 Installation and execution
```bash
# Cloning the repository and accessing the directory
git clone git@github.com:GaraJao/api.git && cd api

# Installing the dependencies
yarn install

# Generating database migration
yarn migrate:generate

# Running migration on database
yarn migrate:run

# Running database inserts
yarn seed

# Running project
yarn dev
```
##### Rename the `.env.example` file to `.env` and fill in the parameters.

## 🛠️ Technologies

- [NodeJS](https://nodejs.org/en)
- [Express](https://expressjs.com/pt-br/)
- [Typescript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)
- [Expo server SDK](https://github.com/expo/expo-server-sdk-node)
- [Cron job](https://cron-job.org/en/)

## 📄 License
MIT © GaraJão