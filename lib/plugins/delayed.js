'use strict';

require('../stanza/delayed');


module.exports = function (client) {
    client.disco.addFeature('urn:xmpp:delay');
};
