const axios = require('axios')
const tough = require('tough-cookie');

// user for the tests.
const user = {
  "_id": "1",
  "email": "test@test.com",
  "password": "test!123",
}

let jwtToken;

const url = "http://127.0.0.1:3000"

beforeAll(async () => {
  // Prepare test data
  const validCredentials = {
    email: user.email,
    password: user.password,
  };

  // Send a request to the login endpoint with valid credentials
  const response = await axios.post(url + '/login', validCredentials);

  // Extract the JWT token from the response cookies
  const cookies = response.headers['set-cookie'];
  const jwtCookie = cookies.find((cookie) => cookie.startsWith('jwt='));
  // Cleaning up token
  jwtToken = jwtCookie.split('=')[1];
  jwtToken = jwtToken.split(';')[0];
  console.log(jwtToken)

});

describe('The router', () => {
  test('Sanity check', async () => {
    const res = await axios.get(url)

    expect(res).toBeTruthy()
    expect(res.status).toBe(200)
  })
})

describe("Login route", () => {
  test('Should not allow login for invalid credentials', async () => {
    // Prepare test data
    const invalidCredentials = {
      email: 'invalid@example.com',
      password: 'wrongpassword',
    };
    try {
      // Send a request to the login endpoint with invalid credentials
      const response = await axios.post(url + '/login', invalidCredentials);

    } catch (error) {
      // Asserts that an error was raised and the login didn't go through.
      expect(error.request).toBeDefined()
    }
  });

  test('Should allow login with valid credentials', async () => {
    // Prepare test data
    const validCredentials = {
      email: user.email,
      password: user.password,
    };

    // Send a request to the login endpoint with valid credentials
    const response = await axios.post(url + '/login', validCredentials);

    // Verify the response
    expect(response.status).toBe(200);
    expect(response.data).toBeDefined();
    expect(response.headers['set-cookie']).toBeDefined();

    // Extract the JWT token from the response cookies
    const cookies = response.headers['set-cookie'];
    const jwtCookie = cookies.find((cookie) => cookie.startsWith('jwt='));
    let jwtToken2 = jwtCookie.split('=')[1];
    jwtToken2 = jwtToken2.split(';')[0]
    expect(jwtCookie).toBeDefined();

    const response2 = await axios.post(url + '/logout', null, {
      headers: {
        Cookie: `jwt=${jwtToken2}`,
      },
    });

  });
});

describe('User Route', () => {
  test('Should retrieve user details', async () => {
    try {
      // Send a GET request to the user endpoint with the JWT token as the cookie
      const response = await axios.get(url + '/user', {
        headers: {
          Cookie: `jwt=${jwtToken}`,
        },
      });

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.data).toEqual({
        name: { first: 'test', last: 'lastTest' },
        email: 'test@test.com',
        address: undefined,
        picture: '',
        age: 99,
        phone: undefined,
      });
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  });
});

describe('Get Balance Endpoint', () => {
  test('Should retrieve account balance', async () => {
    try {
      // Send a GET request to the get-balance endpoint with the JWT token as the cookie
      const response = await axios.get(url + '/get-balance', {
        headers: {
          Cookie: `jwt=${jwtToken}`,
        },
      });

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ balance: '$0' });
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  });
});

describe('Logout route', () => {
  test('Should logout user successfully', async () => {
    try {
      // Send a request to the logout endpoint with the JWT token as the cookie
      const response = await axios.post(url + '/logout', null, {
        headers: {
          Cookie: `jwt=${jwtToken}`,
        },
      });

      // Verify the response
      expect(response.status).toBe(200);
      expect(response.data).toBe('Logged out successfully');
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  });
});