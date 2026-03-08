const API_URL = 'https://script.google.com/macros/s/AKfycbztGCKg5Sqz2Bl7QqSecB_4JXyTHK_vNWXHbm4hL5egDs5WfWMG2UWCHrcMDE_rRq-I/exec';

async function test() {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getOrders' }),
    });
    const data = await res.json();
    console.log("ALL DATA:");
    console.log(JSON.stringify(data, null, 2));
}

test();
