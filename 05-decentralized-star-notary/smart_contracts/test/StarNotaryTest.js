const StarNotary = artifacts.require('StarNotary');

contract('StarNotary', accounts => {
  const name = 'Achernar';
  const starStory = 'A star meaning The Last River in Arabic';
  const ra = 'ra_01.37.42.84548';
  const dec = 'dec_-57.14.12.3101';
  const mag = 'mag_0.40-.46';
  let user1 = accounts[1];
  let user2 = accounts[2];
  const tokenId = 1;
  let starPrice = web3.utils.toWei('.01', 'ether');

  beforeEach(async function() {
    this.contract = await StarNotary.new({ from: accounts[0] });
  });

  // createStar Test
  describe('can create a star', () => {
    it('can create a star and get its name', async function() {
      await this.contract.createStar(name, starStory, ra, dec, mag);
      it('can create a star and get its data', async function() {
        assert.deepEqual(await this.contract.tokenIdToStarInfo(tokenId), [
          name,
          starStory,
          ra,
          dec,
          mag,
        ]);
      });
    });
  });

  // Buying and selling stars tests
  describe('buying and selling stars', () => {
    beforeEach(async function() {
      await this.contract.createStar(name, starStory, ra, dec, mag, {
        from: user1,
      });
    });

    // putStarUpForSale test
    it('user1 can put up their star for sale', async function() {
      assert.equal(await this.contract.ownerOf(tokenId), user1);
      await this.contract.putStarUpForSale(tokenId, starPrice, { from: user1 });

      assert.equal(await this.contract.starsForSale(tokenId), starPrice);
    });

    // buyStar test
    it('user2 is the owner of the star after they buy it', async function() {
      await this.contract.putStarUpForSale(tokenId, starPrice, { from: user1 });
      await this.contract.buyStar(tokenId, {
        from: user2,
        value: starPrice,
        gasPrice: 0,
      });
      assert.equal(await this.contract.ownerOf(tokenId), user2);
    });
  });

  // checkIfStarExists test
  describe('check the existance of stars', () => {
    it('The star exists', async function () {
        await this.contract.createStar(name, starStory, ra, dec, mag, {from: user1});
        assert.equal(await this.contract.checkIfStarExists(ra, dec, mag), true);
      });
  });

  // mint test
  describe('check if mint method works', () => {
    it('it mints properly!', async function () {
      beforeEach(async function (){
        tx = await this.contract.mint(tokenId, {from: user1})
        it('assigned token to correct user'), async function (){
          let owner = await this.contract.ownerOf(tokenId, {from: user1})
          assert.equal(owner, user1)
        }
      })
    });
  });

});
