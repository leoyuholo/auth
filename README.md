#auth
A Node.js challenge-response authentication example with the use of AES and SHA1

#How to run
After installed [Node.js](http://nodejs.org/), go to project directory and run
```
npm install
node index.js
```
Then, visit
```
http://[your_ip]:8080
```

##Redis datastore
Default using in-memory datastore. To use Redis as datastore,

Create config.json in project directory, define redis endpoint in config.json, like:
```
{
	"redis": {
		"ip": "127.0.0.1",
		"port": "6379"
	}
}
```

##PostgreSQL datastore
Same as Redis datastore,

Create config.json in project directory, define PostgreSQL endpoint in config.json, like:
```
{
	"postgre": {
		"url": "tcp://user:pw@localhost/db"
	}
}
```
Beware of the installation of npm module [pg](https://github.com/brianc/node-postgres) requires extra dependencies,
```
sudo apt-get install libpq-dev build-essential
```
read the installation [guide](https://github.com/brianc/node-postgres/wiki/Installation#ubuntu)
