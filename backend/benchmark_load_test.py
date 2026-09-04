"""
TradeX Concurrency & Throughput Benchmark Test Script
=====================================================
Simulates 100 concurrent virtual users sending 1,000 requests to test system performance.
"""

import time
import urllib.request
import json
from concurrent.futures import ThreadPoolExecutor

# Configurable Test Parameters
API_URL = "http://127.0.0.1:8000"
TOTAL_REQUESTS = 1000
CONCURRENT_WORKERS = 100

def send_request(req_id):
    """Worker function representing 1 request sent by a virtual user thread."""
    url = f"{API_URL}/"
    start = time.time()
    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10.0) as response:
            latency = (time.time() - start) * 1000  # Convert to milliseconds
            return response.status, latency
    except Exception as e:
        return 500, 0

def run_benchmark():
    print(f"🚀 Starting TradeX Benchmark Test...")
    print(f"👥 Virtual Users (Threads) : {CONCURRENT_WORKERS}")
    print(f"📦 Total Load Requests     : {TOTAL_REQUESTS}")
    print(f"🎯 Target Endpoint         : {API_URL}/")
    print("-" * 60)

    start_total = time.time()
    results = []

    # Spawn 100 worker threads executing 1,000 total requests
    with ThreadPoolExecutor(max_workers=CONCURRENT_WORKERS) as executor:
        futures = [executor.submit(send_request, i) for i in range(TOTAL_REQUESTS)]
        for f in futures:
            results.append(f.result())

    total_time = time.time() - start_total
    status_codes = [r[0] for r in results]
    latencies = [r[1] for r in results if r[0] == 200]

    success_count = status_codes.count(200)
    avg_latency = sum(latencies) / len(latencies) if latencies else 0
    min_latency = min(latencies) if latencies else 0
    max_latency = max(latencies) if latencies else 0
    rps = len(results) / total_time

    print("==================================================")
    print("📊 TRADEX LOAD TEST BENCHMARK RESULTS")
    print("==================================================")
    print(f"✅ Total Requests Processed : {len(results)}")
    print(f"🟢 Successful Requests (200) : {success_count} ({round(success_count/len(results)*100, 1)}%)")
    print(f"⏱️  Total Duration          : {round(total_time, 2)} seconds")
    print(f"⚡ Throughput (RPS)         : {round(rps, 2)} req/sec")
    print(f"📈 Average Response Latency : {round(avg_latency, 2)} ms")
    print(f"🏎️  Min Latency             : {round(min_latency, 2)} ms")
    print(f"🐢 Max Latency             : {round(max_latency, 2)} ms")
    print("==================================================")

if __name__ == "__main__":
    run_benchmark()
