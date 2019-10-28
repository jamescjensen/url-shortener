echo "stopping old versions..";
docker stop url-shortener;
docker stop postgres-local;
docker network rm url-shortener-network;

docker network create --subnet 192.168.2.0/24 url-shortener-network;
docker pull postgres;
docker run --name postgres-local --rm --detach --network url-shortener-network -e POSTGRES_PASSWORD=password -e POSTGRES_DB=url-shortener --ip=192.168.2.2 --publish 5432:5432 postgres;
docker build --rm --tag local-container .;
docker run --name url-shortener --network url-shortener-network -d -p 22222:8080 --env DOCKER_PORT=22222 --rm local-container;

docker logs -f url-shortener;