# GaraJão API

<p align='left'>
  <img alt='License' src='https://img.shields.io/static/v1?label=license&message=MIT&color=d58453&labelColor=555' />
  <img alt='version' src='https://img.shields.io/static/v1?label=version&message=v1.0&color=d58453&labelColor=555' />
</p>

##### Rename the `.env.example` file to `.env` and fill in the parameters

## 📥 Installation and execution
```bash
# Cloning the repository and accessing the directory
git clone https://github.com/GaraJao/api.git && cd api

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

## 🛠️ Technologies

- [NodeJS](https://nodejs.org/en)
- [Express](https://expressjs.com/pt-br/)
- [Typescript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [TypeORM](https://typeorm.io/)

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