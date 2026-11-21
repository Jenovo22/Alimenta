import os
from rq import Worker, Queue, Connection
from redis import Redis

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
redis_conn = Redis.from_url(redis_url)

listen = [
    Queue('ponderacion', connection=redis_conn),
    Queue('asignacion', connection=redis_conn),
    Queue('cleanup', connection=redis_conn),
]

if __name__ == '__main__':
    with Connection(redis_conn):
        worker = Worker(listen)
        worker.work()
