
docker pull mongo
docker stop callmelaterdb
docker rm callmelaterdb
docker run -d -v /root/data/callmelaterdb:/data/db  --name callmelaterdb mongo