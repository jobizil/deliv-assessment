import { resolvers } from '../src/resolvers';

describe('Resolvers', () => {
  it('should fetch vendors with menus', async () => {
    const vendors = await resolvers.Query.fetchVendors({limit:2, offset:5});
    expect(vendors).toBeInstanceOf(Array);
  });
});
