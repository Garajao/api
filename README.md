# GaraJão API

<p align='left'>
  <img alt='License' src='https://img.shields.io/static/v1?label=license&message=MIT&color=d58453&labelColor=555' />
  <img alt='version' src='https://img.shields.io/static/v1?label=version&message=v1.0&color=d58453&labelColor=555' />
</p>

##### Create the `.env` file with the parameters below in the root of the project
```
DB_HOST = localhost
DB_PORT = 5432
DB_USER = postgres
DB_PASS = postgres
DB_NAME = garajao

PORT = 3000
JWT_PASS = ABCD
```

### Commands to run project
##### 1. Install dependencies
```
yarn install
```
##### 2. Generate database migration
```
yarn migrate:generate
```
##### 3. Run migration on database
```
yarn migrate:run
```
##### 4. Run database inserts
```
yarn seed
```
##### 5. Run project
```
yarn dev
```

## 🛠️ Technologies

- [x] NodeJS
- [x] Typescript
- [x] PostgreSQL
- [x] TypeORM
- [x] Express

## ⚙️ API endpoints

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