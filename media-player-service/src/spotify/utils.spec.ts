import { createURLWithQuery } from './utils';

describe('testing spotify utility function', () => {
  it('create url from object correctly', () => {
    const createdURL = createURLWithQuery(
      'https://accounts.spotify.com/authorize?',
      {
        response_type: 'code',
        client_id: 'test_clientId',
        scope: 'test_clientScope',
        redirect_uri: 'http://localhost:3000/callback',
        state: 'test_state',
      },
    );
    console.log(createdURL);
    expect(createdURL).toBe(
      'https://accounts.spotify.com/authorize?/response_type=code&client_id=test_clientId&scope=test_clientScope&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&state=test_state',
    );
  });
});
