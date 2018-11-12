docker stop callmelaterapp
docker rm callmelaterapp
#-p 127.0.0.1:80:80
docker run -d --name callmelaterapp --link callmelaterdb:mongo --restart always  \
    -e "NODE_ENV=production" \
    -e "VIRTUAL_HOST=callmelater.pohl.rocks" -e "PORT=80" \
    -e "LETSENCRYPT_HOST=callmelater.pohl.rocks" -e "LETSENCRYPT_EMAIL=thpohl@gmail.com" \
    -e "MONGODB_URI=mongodb://mongo/tasks" flightsweb