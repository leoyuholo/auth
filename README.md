#auth_redis
This branch uses redis as datastore instead of default in-memory datastore

A simple Node.js challenge-response authentication example with the use of AES and SHA1

#How to run
Install [Node.js] (http://nodejs.org/), go to project directory and run
```
npm install
node index.js
```
Then, visit
```
http://[your_ip]:8080
```

#Redis Config
Define redis endpoint in config.json, like
```
{
	"redis": {
		"ip": "127.0.0.1",
		"port": "6379"
	}
}
```