#auth
A Node.js challenge-response authentication example with the use of AES and SHA1

#How to run
After installed [Node.js] (http://nodejs.org/), go to project directory and run
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