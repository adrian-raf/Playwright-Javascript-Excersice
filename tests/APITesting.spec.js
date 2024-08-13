import { test, expect } from '@playwright/test';

let userId;

test('Get Users', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users?page=2');
  console.log(await response.json());
  expect(response.status()).toBe(200);
});
test('Create User', async ({ request }) => {
  const response = await request.post('https://reqres.in/api/users', {
    data: {
      name: 'Adrian',
      job: 'SQA',
    },
    headers: {
      Accept: 'application/json',
    },
  });
  const res = await response.json();
  console.log(res);
  userId = res.id;
  expect(res).toHaveProperty('id');
  expect(response.status()).toBe(201);
});

// test('Get Single User', async ({ request }) => {
//   const response = await request.get('https://reqres.in/api/users/' + userId);
//   console.log(await response.json());
//   expect(response.status()).toBe(200);
// });

test('Update User', async ({ request }) => {
  const response = await request.put('https://reqres.in/api/users/' + userId, {
    data: {
      name: 'Rafly',
      job: 'Dev',
    },
  });
  const res = await response.json();
  expect(response.status()).toBe(200);
  expect(res).toHaveProperty('updatedAt');
});
test('Delete User', async ({ request }) => {
  const response = await request.delete('https://reqres.in/api/users/' + userId);
  expect(response.status()).toBe(204);
  expect(response).not.toBe({});
});
