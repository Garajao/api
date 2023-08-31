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

## ⚙️ API documentation

#### 1. USERS

| Description  | Method | Path |
| - | - | - |
List users | `GET` | /api/users
 Create user | `POST` | /api/users
Update user | `PATCH` | /api/users/`:idUser`
Delete user | `DELETE` | /api/users/`:idUser`
Login | `POST` | /api/users/login
Get profile | `GET` | /api/users/profile
Link gate to the user | `POST` | /api/users/`:idUser`/gate
List gates by user | `GET` | /api/gates/`:idUser`/user

#### 2. GATES

| Description  | Method | Path |
| - | - | - |
List gates | `GET` | /api/gates
Create gate | `POST` | /api/gates
Update gate | `PATCH` | /api/gates/`:idGate`
Delete gate | `DELETE` | /api/gates/`:idGate`
Find gate | `GET` | /api/gates/`:idGate`
Page solicitations | `GET` | /api/gates/`:idGate`/solicitations`?limit=4&offset=0`

#### 3. SOLICITATIONS

| Description  | Method | Path |
| - | - | - |
List solicitations | `GET` | /api/solicitations
Create solicitation | `POST` | /api/solicitations
Update solicitation | `PATCH` | /api/solicitations/`:idSolicitation`
Delete solicitation | `DELETE` | /api/solicitations/`:idSolicitation`

#### 4. ROLES

| Description  | Method | Path |
| - | - | - |
List roles | `GET` | /api/roles
Create role | `POST` | /api/roles
Update role | `PATCH` | /api/roles/`:idRole`
Delete role | `DELETE` | /api/roles/`:idRole`

## 📄 License
MIT © GaraJão