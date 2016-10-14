'use strict'

const https = require('https'),
      querystring = require('querystring'),
      moment = require('moment'),
      config = {
        host: 'torrentapi.org',
        path: '/pubapi_v2.php?'
      }


module.exports = {

  categories: {
    XXX: 4,
    MOVIES_XVID: 14,
    MOVIES_XVID_720: 48,
    MOVIES_X264: 17,
    MOVIES_X264_1080: 44,
    MOVIES_X264_720: 45,
    MOVIES_X264_3D: 47,
    MOVIES_FULL_BD: 42,
    MOVIES_BD_REMUX: 46,
    TV_EPISODES: 18,
    TV_HD_EPISODES: 41,
    MUSIC_MP3: 23,
    MUSIC_FLAC: 25,
    GAMES_PC_ISO: 27,
    GAMES_PC_RIP: 28,
    GAMES_PS3: 40,
    GAMES_XBOX_360: 32,
    SOFTWARE_PC_ISO: 33,
    E_BOOKS: 35
  },

  lastRequestTime: moment(),

  validateParams() {
    return new Promise((resolve, reject) => {
      if (!this.query.mode) {
        reject('Invalid query object -- no search mode')
      } else if (this.query.mode === 'search') {
        if (!this.query.search_string &&
            !this.query.search_themoviedb &&
            !this.query.search_tvdb &&
            !this.query.search_imdb) {

          reject('Invalid query object -- no search parameters')
        }
      } else if (this.query.mode !== 'list') {
        reject('Invalid query object -- search mode invalid')
      }

      resolve()
    })
  },

  setToken() {
    return this.sendRequest({
      get_token: 'get_token'
    }).then(response => this._token = this.query.token = response.token)
  },

  getToken() {
    if (this._token) {
      return new Promise((resolve, reject) => {
        resolve()
      }).then(() => this.query.token = this._token)
    }

    return this.setToken()
  },

  retrieveToken() {
    return this.sendRequest({ get_token: 'get_token' })
  },

  search(query) {
    query.mode = 'search'
    this.query = query

    return this.apiRequest()
  },

  list(query = {}) {
    query.mode = 'list'
    this.query = query

    return this.apiRequest()
  },

  apiRequest() {
    return new Promise((resolve, reject) => {
      Promise.all([this.validateParams(), this.getToken()])
        .then(() => {
          // There's a 1 request/2 second rate limit
          const delay = 2000 - moment().diff(this.lastRequestTime)

          setTimeout(() => {
            this.sendRequest()
              .then(results => {
                if (results.torrent_results)
                  resolve(results.torrent_results)
                else
                  reject(results)
              })
              .catch(e => reject(e))
          }, delay > 0 ? delay : 0)
        })
    })
  },

  sendRequest(query = this.query) {
    return new Promise((resolve, reject) => {
      const req = {
        host: config.host,
        path: config.path + querystring.stringify(query)
      }

      https.get(req, res => {
        this.lastRequestTime = moment()
        let body = ''

        res.on('data', d => {
          body += d
        })

        res.on('end', () => {
          resolve(JSON.parse(body))
        })

        res.on('error', e => {
          reject(e)
        })

      })
    })
  }

}