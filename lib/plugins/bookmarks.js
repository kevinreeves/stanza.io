'use strict';

require('../stanza/bookmarks');

var _ = require('underscore');
var JID = require('../jid');


module.exports = function (client) {
    client.getBookmarks = function (cb) {
        return this.getPrivateData({bookmarks: true}, cb);
    };

    client.setBookmarks = function (opts, cb) {
        return this.setPrivateData({bookmarks: opts}, cb);
    };

    client.addBookmark = function (bookmark, cb) {
        bookmark.jid = new JID(bookmark.jid);

        return this.getBookmarks().then(function (res) {
            var bookmarks = res.privateStorage.bookmarks.conferences || [];
            var existing = _.filter(bookmarks, function (bm) {
                return bm.jid.bare === bookmark.jid.bare;
            });

            if (existing.length) {
                _.extend(existing[0], bookmark);
            } else {
                bookmarks.push(bookmark);
            }

            return client.setBookmarks({conferences: bookmarks});
        }).nodeify(cb);
    };

    client.removeBookmark = function (jid, cb) {
        jid = new JID(jid);
        return this.getBookmarks().then(function (res) {
            var bookmarks = res.privateStorage.bookmarks.conferences || [];
            bookmarks = _.filter(bookmarks, function (bm) {
                return jid.bare !== bm.jid.bare;
            });
            return client.setBookmarks({conferences: bookmarks});
        }).nodeify(cb);
    };
};
