const request = require('request');
require('dotenv').config({ path: './password.env' });


const getAccessToken = function () {
    return new Promise(function (resolve, reject) {
        const url = 'https://login.microsoftonline.com/common/oauth2/token';
        const username = process.env.MY_USERNAME;
        const password = process.env.PASSWORD;
        const clientId = process.env.CLIENT_ID;
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        
        const formData = {
            grant_type: 'password',
            client_id: clientId,
            resource: 'https://analysis.windows.net/powerbi/api',
            scope: 'openid',
            username: username,
            password: password
        };

        request.post({
            url: url,
            form: formData,
            headers: headers
        }, function (err, result, body) {
            if (err) return reject(err);
            const bodyObj = JSON.parse(body);
            console.log('Access Token:', bodyObj.access_token);
            resolve(bodyObj.access_token);
        });
    });
};

const getReportEmbedToken = function (accessToken, groupId, reportId) {
    return new Promise(function (resolve, reject) {
        const url = 'https://api.powerbi.com/v1.0/myorg/groups/' + groupId + '/reports/' + reportId + '/GenerateToken';
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + accessToken
        };
        const formData = {
            'accessLevel': 'view'
        };

        request.post({
            url: url,
            form: formData,
            headers: headers
        }, function (err, result, body) {
            if (err) return reject(err);
            const bodyObj = JSON.parse(body);
            console.log('Embed Token:', bodyObj.token);
            resolve(bodyObj.token);
        }).on('response', function (response) {
            if (response.statusCode === 401) {
                // Se o status de resposta for 401, o token expirou ou é inválido
                // Chame as funções novamente para obter um novo token de acesso e token de inserção do relatório
                getAccessToken().then(function (newAccessToken) {
                    getReportEmbedToken(newAccessToken, groupId, reportId).then(resolve).catch(reject);
                }).catch(reject);
            }
        });
    });
};


module.exports = {
    embedReport: function (req, res) {
        getAccessToken().then(function (accessToken) {
            getReportEmbedToken(accessToken, req.params.groupId, req.params.reportId).then(function (embedToken) {
                res.render('index', {
                    reportId: req.params.dashboardId,
                    embedToken,
                    embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=' + req.params.reportId + '&groupId=' + req.params.groupId
                });
            }).catch(function (err) {
                console.error('Error getting embed token:', err);
                res.status(500).send(err);
            });
        }).catch(function (err) {
            console.error('Error getting access token:', err);
            res.status(500).send(err);
        });
    }
};