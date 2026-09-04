import os
import redis
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

# Initialize Redis client with decode_responses=True so values are returned as string instead of bytes
redis_client = None

try:
    if REDIS_URL:
        redis_client = redis.Redis.from_url(
            REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=3,
            socket_timeout=3
        )
        # Test connection ping
        redis_client.ping()
        print("⚡ Successfully connected to Redis!")
except Exception as e:
    print(f"⚠️ Redis connection warning: {e}. Falling back to direct fetching.")
    redis_client = None

def get_redis():
    """Helper getter for the global redis_client instance."""
    return redis_client
