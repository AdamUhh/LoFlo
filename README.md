# Welcome to Loflo

## How to install

``` cli
pnpm i
```

## How to run development

``` cli
pnpm dev
```

## NextAuth

- For github credentials, remember that it should be an OAuth App, not the Github App

## How to start Turso db

- Requirements to run: [Turso CLI](https://docs.turso.tech/reference/turso-cli)
  
### My steps to install Turso CLI on Windows

- Download WSL
- Download [Homebrew](https://brew.sh/) (if not installed)
  - Follow cli steps to ensure it's added to your PATH
  - Run `sudo apt-get update`
  - Ensure [Build tools](https://docs.brew.sh/Homebrew-on-Linux#requirements) are installed: `sudo apt-get install build-essential procps curl file git`
  - Ensure gcc is installed `brew install gcc`
- Install [Turso CLI](https://docs.turso.tech/reference/turso-cli) using the following command (at the time of writing this): `brew install tursodatabase/tap/turso`
- Go to the [Releases Page](https://github.com/libsql/sqld/releases) and copy the link to the latest linux file, example:`sqld-x86_64-unknown-linux-gnu.tar.xz`
- Open WSL terminal (not cmd, has to be WSL), type `cd` to go to root, and run `wget LATEST_LINK__HERE`, ex: `wget https://github.com/libsql/sqld/releases/download/v0.21.9/sqld-x86_64-unknown-linux-gnu.tar.xz`
- Unzip the tar file using `tar -xf FILE_NAME`, ex: `tar -xf sqld-x86_64-unknown-linux-gnu.tar.xz`
- Type `ls` to view the name of the extracted folder
- `cd` into the folder, ex: `sqld-x86_64-unknown-linux-gnu/`
- Move `sqld` into a system-wide directory using `sudo mv sqld /usr/local/bin/`
- Open `~/.bashrc` using `vim ~/.bashrc` or an editor of your choice (eg: `nano`)
  - Use your arrow key to go all the way down to a new line, press the `Insert` key on your keyboard, and paste `export PATH="/usr/local/bin/sqld:$PATH"`
  - Then, press `Escape` on your keyboard, type `:w` and press `ENTER`
  - Then type `:x`, and press `ENTER`
  - Type `source ~/.bashrc` in the terminal (to refresh paths)
- Verify sqld works by typing `sqld --version`
- Then run locally, using the Turso command below

Also, if you accidentally typed `exit` on the WSL terminal, and it lost color, packages, and functionality, type `source ~/.bashrc`

### Run db locally

``` cli
turso dev --db-file dev.db
```

### Push db

``` cli
pnpm db:push
```

### Drizzle Studio

``` cli
pnpm studio
```

## Production

- First, login - you may need to add `--headless` at the end
- if you do need `--headless`, just sign in and paste the secret export to your cli

```cli
turso auth login
```

- Then, create your database name

```cli
turso db create DBNAME
```

- Then, show your newly create db's info
- It will show a URL, put that in your `.env.local` as your `DATABASE_URL`

```cli
turso db show DBNAME
```

- Then, create a secret token for your db
- Use that as your `DATABASE_AUTH_TOKEN`
- `-e none` is to not expire

```cli
turso db tokens create DBNAME -e none
```

- Upload app to vercel with these environment variables, and you're done :P

```cli
vercel --prod
```
