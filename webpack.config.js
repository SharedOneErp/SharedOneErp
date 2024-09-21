var path = require('path');
const webpack = require('webpack');

// 경로 변수 정의
const salesPath = './components/sales/';
const pricePath = './components/price/';
const productPath = './components/product/';
const customerPath = './components/customer/';
const hrPath = './components/hr/';

module.exports = {
    context: path.resolve(__dirname, 'src/main/react'), // 기본 디렉토리 설정
    entry: {
        login: './components/auth/Login.js', // 로그인
        main: './components/main/Main.js', // 메인 대시보드

        // Sales 관련 엔트리 포인트
        order: `${salesPath}Order.js`, // 주문 등록or상세or수정
        orderList: `${salesPath}OrderList.js`, // 주문 목록 or 주문 등록 승인
        orderReport: `${salesPath}OrderReport.js`, // 영업실적 보고서

        // Product 관련 엔트리 포인트
        productList: `${productPath}ProductList.js`, // 상품 목록
        productPrice: `${pricePath}Price.js`, // 고객사별 상품 가격 관리(목록/등록/수정)
        productCategory: `${productPath}ProductCategory.js`, // 상품 카테고리 관리(목록/등록/수정)

        // Customer 관련 엔트리 포인트
        customerList: `${customerPath}CustomerList.js`, // 고객사 목록

        // HR 관련 엔트리 포인트
        employeeList: `${hrPath}EmployeeList.js`, // 직원 목록
        employeeRegister: `${hrPath}EmployeeRegister.js`, // 직원 등록
    },
    devtool: 'sourcemaps', // 소스 맵 생성 설정
    cache: true, // 캐싱 활성화
    output: {
        path: path.resolve(__dirname, 'src/main/resources/static/bundle'), // 출력 경로 설정
        filename: '[name].bundle.js' // 번들 파일 이름 설정
    },
    mode: 'none', // Webpack 모드 설정 (none: 기본 설정)
    module: {
        rules: [
            {
                test: /\.m?js$/, // .mjs 또는 .js 파일을 처리
                resolve: {
                    fullySpecified: false // 확장자를 명시하지 않아도 되도록 설정(특히 axios나 다른 모듈에서 발생하는 확장자 문제를 피할 수 있다.)
                }
            },
            {
                test: /\.js?$/, // .js 파일 처리
                exclude: /(node_modules)/, // node_modules 제외
                use: {
                    loader: 'babel-loader', // Babel 로더 사용
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'] // Babel 프리셋 설정
                    }
                }
            },
            {
                test: /\.css$/, // .css 파일 처리
                use: ['style-loader', 'css-loader'] // 스타일 및 CSS 로더 사용
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/, // 이미지 파일 처리
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]', // 파일 이름 및 경로 설정
                            context: 'src/main/react', // 소스 경로 설정
                        },
                    },
                ],
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser', // "process is not defined" 오류 해결
        }),
        // Webpack 빌드가 완료되면 시간을 출력하는 플러그인
        function () {
            // Webpack의 done 후크를 사용하여 빌드가 완료될 때 호출
            this.hooks.done.tap('DonePlugin', (stats) => {
                const now = new Date().toLocaleString();
                // 콘솔에 빨간색 구분선 및 메시지 출력
                console.log("\x1b[31m%s\x1b[0m", "\n\n\n=============================================");
                console.log("\x1b[31m%s\x1b[0m", `${now} 빌드 완료`); // 빌드 완료 시간 출력
                console.log("\x1b[31m%s\x1b[0m", "=============================================");
            });
        },
    ],
    // resolve는 모듈을 해석할 때, 필요한 설정을 지정하는 옵션
    resolve: {
        // fallback 옵션은 브라우저 환경에서 Node.js의 일부 기능을 사용할 수 있도록 대체 모듈을 지정하는 데 사용됩니다.
        fallback: {
            // 'process' 모듈을 브라우저에서 사용할 수 있도록 'process/browser' 모듈을 대체로 지정합니다.
            process: require.resolve('process/browser'),
            "url": require.resolve("url/") // 브라우저에서 'url' 모듈을 사용할 수 있도록 합니다.
        },
        alias: {
            'process': 'process/browser',
        },

    }
};
