'use strict'

const { expect } = require('chai')
const RarbgApi = require('..')

describe('rarbg', () => {
  let rarbg

  before(() => {
    rarbg = new RarbgApi()
  })

  function testOutputAttributes (output) {
    expect(output).to.be.an('array')

    const random = Math.floor(Math.random() * output.length)
    const toTest = output[random]

    expect(toTest.filename).to.be.a('string')
    expect(toTest.category).to.be.a('string')
    expect(toTest.download).to.be.a('string')
  }

  it('should search for torrents', done => {
    rarbg.search({
      search_string: 'star wars',
      sort: 'seeders',
      category: rarbg.categories.MOVIES_X264_1080,
      min_seeders: 50
    }).then(res => {
      testOutputAttributes(res)
      done()
    }).catch(done)
  })

  it('should not find any torrents', done => {
    rarbg.search({
      search_string: `This movie doesn't exist`,
      category: rarbg.categories.MOVIES_X264_1080
    }).then(done).catch(err => {
      expect(err).to.be.an('Error')
      expect(err.message).to.equal('No results found!')

      done()
    })
  })

  it('should throw an error when the wrong params are given', done => {
    rarbg.search({
      search_strin: 'star wars'
    }).then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        expect(err.message).to.equal('Invalid query object -- no search parameters')

        done()
      })
  })

  it('should list the recent torrent', done => {
    rarbg.list().then(res => {
      testOutputAttributes(res)
      done()
    }).catch(done)
  })

  it('should throw an error when no params are given', done => {
    rarbg.validateParams({})
      .then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        expect(err.message).to.equal('Invalid query object -- no search mode')

        done()
      })
  })

  it('should throw an error when the wrong params are given', done => {
    rarbg.validateParams({
      mode: 'search',
      search_strin: 'star wars'
    }).then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        expect(err.message).to.equal('Invalid query object -- no search parameters')

        done()
      })
  })

  it('should throw an error a faulty mode is given', done => {
    rarbg.validateParams({
      mode: 'faulty'
    }).then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        expect(err.message).to.equal('Invalid query object -- search mode invalid')

        done()
      })
  })

  it('should throw an error when a request is not valid', done => {
    const temp = rarbg.config
    rarbg.config = {
      host: 'somefaultyhost.com',
      path: '/somefaultypath.php?'
    }

    rarbg.search({
      search_string: 'star wars'
    }).then(done)
      .catch(err => {
        expect(err).to.be.an('Error')

        rarbg.config = temp
        done()
      })
  })
})
