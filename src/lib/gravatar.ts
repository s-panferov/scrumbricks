const MD5 = require('./md5');

export function getGravatarUrl(email: string, size = 80) {
    return 'http://www.gravatar.com/avatar/' + MD5(email) + '.jpg?s=' + size;
}
