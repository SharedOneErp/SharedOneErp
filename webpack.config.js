var path = require('path');
const webpack = require('webpack');

module.exports = {
    context: path.resolve(__dirname, 'src/main/react'), // 기본 디렉토리 설정
    entry: {
        main: './components/Main.js', // 엔트리 포인트 설정
        orderListAll:'./components/sales/OrderListAll.js',
        orderListAssigned : './components/sales/OrderListAssigned.js',
        orderRegister : './components/sales/OrderRegister.js',
        orderDetail:'./components/sales/OrderDetail.js',
        orderRegisterApproval: './components/sales/OrderRegisterApproval.js',
        orderReport : './components/sales/OrderReport.js',
    },
    devtool: 'sourcemaps', // 소스 맵 생성 설정
    cache: true, // 캐싱 활성화
    output: {
        path: __dirname, // 출력 경로 설정
        filename: './src/main/resources/static/bundle/[name].bundle.js' // 번들 파일 이름
    },
    mode: 'none', // Webpack 모드 설정 (none: 기본 설정)
    module: {
        rules: [
            {
                test: /\.js?$/, // .js 파일에 대한 규칙
                exclude: /(node_modules)/, // 제외할 디렉토리
                use: {
                    loader: 'babel-loader', // Babel 로더 사용
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'] // Babel 프리셋 설정
                    }
                }
            },
            {
                test: /\.css$/, // .css 파일에 대한 규칙
                use: ['style-loader', 'css-loader'] // CSS 처리 로더
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser', // "process is not defined" 오류 해결
        }),
    ],
};