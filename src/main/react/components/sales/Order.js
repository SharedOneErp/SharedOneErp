import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import {BrowserRouter, useSearchParams} from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/sales/Order.css';

function Order() {
    const [searchParams] = useSearchParams();
    const orderNo = searchParams.get('no'); // 주문번호
    const mode = searchParams.get('mode') || 'view'; // 'edit' 또는 'view'


    // 등록/수정/상세 구분
    const isCreateMode = !orderNo; // 주문번호 없으면 등록 모드
    const isEditMode = mode === 'edit'; // 수정 모드
    const isDetailView = !!orderNo && mode === 'view'; // 상세보기 모드

    // 상태들
    const [products, setProducts] = useState([{name: '', price: '', quantity: ''}]);
    const [customer, setCustomer] = useState([]);

    const [orderDetails, setOrderDetails] = useState([{productNm:'',orderDPrice:'',orderDQty:'',productCd:''}]);
    const [showModal, setShowModal] = useState(false); // 모달 상태
    const [customerModalOpen, setCustomerModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
    const [searchCode, setSearchCode] = useState(''); // 상품코드 상태
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
    const [customerSearchResults, setCustomerSearchResults] = useState([]); // 고객 검색 결과
    const [orderHTotalPrice, setOrderHTotalPrice] = useState(0);
    const [orderHInsertDate, setOrderHInsertDate] = useState(0);


    //직원
    const [employee, setEmployee] = useState(null); // 사용자 정보 넘기는 변수

    //상품
    const [selectedProductIndex, setSelectedProductIndex] = useState(null);
    //상품 인덱스 확인 후 등록 로직


    // 페이지네이션 상태
    const [currentPageProduct, setCurrentPageProduct] = useState(1);
    const [itemsPerPageProduct, setItemsPerPageProduct] = useState(10);

    const [currentPageCustomer, setCurrentPageCustomer] = useState(1);
    const [itemsPerPageCustomer, setItemsPerPageCustomer] = useState(10);

    // 상품 모달 페이지네이션 로직
    const indexOfLastProductResult = currentPageProduct * itemsPerPageProduct;
    const indexOfFirstProductResult = indexOfLastProductResult - itemsPerPageProduct;
    const paginatedSearchResults = searchResults.slice(indexOfFirstProductResult, indexOfLastProductResult);
    const totalProductPages = Math.ceil(searchResults.length / itemsPerPageProduct);


// 고객사 모달 페이지네이션 로직
    const indexOfLastCustomerResult = currentPageCustomer * itemsPerPageCustomer;
    const indexOfFirstCustomerResult = indexOfLastCustomerResult - itemsPerPageCustomer;
    const paginatedCustomerSearchResults = customerSearchResults.slice(indexOfFirstCustomerResult, indexOfLastCustomerResult);
    const totalCustomerPages = Math.ceil(customerSearchResults.length / itemsPerPageCustomer);

    //카테고리 셀렉터
    const [categories, setCategories] = useState({
        topCategories: [],
        middleCategories: [],
        lowCategories: []
    });
    const [selectedCategory, setSelectedCategory] = useState({
        top: '',
        middle: '',
        low: ''
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const topResponse = await fetch('/api/category/top');
                const topData = await topResponse.json();
                setCategories(prev => ({ ...prev, topCategories: topData }));

                if (selectedCategory.top) {
                    const middleResponse = await fetch(`/api/category/middle/${selectedCategory.top}`);
                    const middleData = await middleResponse.json();
                    setCategories(prev => ({ ...prev, middleCategories: middleData }));
                }

                if (selectedCategory.middle) {
                    const lowResponse = await fetch(`/api/category/low/${selectedCategory.middle}/${selectedCategory.top}`);
                    const lowData = await lowResponse.json();
                    setCategories(prev => ({ ...prev, lowCategories: lowData }));
                }

            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        fetchCategories();
    }, [selectedCategory.top, selectedCategory.middle]);

    const handleTopChange = (e) => {
        const topValue = e.target.value;
        setSelectedCategory({
            top: topValue,
            middle: '',
            low: ''
        });
        setCategories(prev => ({ ...prev, middleCategories: [], lowCategories: [] }));
    };

    const handleMiddleChange = (e) => {
        const middleValue = e.target.value;
        setSelectedCategory({
            ...selectedCategory,
            middle: middleValue,
            low: ''
        });
        setCategories(prev => ({ ...prev, lowCategories: [] }));
    };


// 페이지 변경 핸들러
    const handlePageChangeProduct = (pageNumber) => {
        setCurrentPageProduct(pageNumber);
    };

    const handlePageChangeCustomer = (pageNumber) => {
        setCurrentPageCustomer(pageNumber);
    };

    const displayItems = orderDetails.map(orderDetail => {
        // productCd를 기준으로 products에서 해당 제품을 찾음
        const matchingProduct = products.find(product => product.productCd === orderDetail.productCd);

        return {
            productCd: orderDetail.productCd,
            productNm: matchingProduct ? matchingProduct.productNm : '',
            orderDPrice: orderDetail.orderDPrice,
            orderDQty: orderDetail.orderDQty,
        };
    });


    const displayItemEdit = orderDetails.map(orderDetail => {
        // productCd를 기준으로 products에서 해당 제품을 찾음
        const matchingProduct = products.find(product => product.productCd === orderDetail.productCd);

        return {
            productCd: orderDetail.productCd,
            productNm: matchingProduct ? matchingProduct.productNm : '', // products에서 찾은 상품명
            orderDPrice: orderDetail.orderDPrice,
            orderDQty: orderDetail.orderDQty,
        };
    });







    // 사용자 정보를 서버에서 가져오는 useEffect
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch('/api/employee', {
                    credentials: "include", // 세션 포함
                });
                if (response.ok) {
                    const data = await response.json();
                    setEmployee(data);
                } else {
                    console.error('사용자 정보를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('사용자 정보를 가져오는 중 오류 발생:', error);
            }
        };
        fetchEmployee();
    }, []);



    // 주문 상세 정보 가져오기 (상세보기/수정용)
    useEffect(() => {
        if (orderNo) {
            fetchOrderDetail(orderNo);
        }
    }, [orderNo]);

    const fetchOrderDetail = async (orderNo) => {
        console.log("-------------------------------------fetchOrderDetail");
        try {
            const response = await fetch(`/api/order?no=${orderNo}`);
            if (!response.ok) throw new Error('주문 데이터를 가져올 수 없습니다.');
            const data = await response.json();
            setOrderDetails(data.orderDetails || []);
            setProducts(data.products || []);
            setEmployee(data.employee || null);
            setCustomer(data.customer || {});
            setOrderHTotalPrice(data.orderHTotalPrice || 0); // 상태 업데이트
            setOrderHInsertDate(data.orderHInsertDate || 0);

            // 상태 업데이트 후 콘솔에 출력
            console.log(data.customer);
            console.log(data.employee);
            console.log("Order Details:", data.orderDetails);
            console.log("Products:", data.products);


        } catch (error) {
            console.error('주문 정보를 가져오는 중 오류가 발생했습니다.', error);
        }
    };


    // 상품 행 추가
    const addProductRow = () => {
        setProducts([...products, {name: '', price: 0, quantity: 0}]);
    };


    const editProductRow = () => {
        setOrderDetails([
            ...orderDetails,
            { productCd: '', productNm: '', orderDPrice: 0, orderDQty: 0 }
        ]);
    };

    // 상품 행 제거
    const removeProductRow = (index) => {
        setProducts(products.filter((_, i) => i !== index));
    };

    // 제품 수정 행 제거
    const removeProducteditRow = (index) => {
        setOrderDetails(orderDetails.filter((_, i) => i !== index));
    };





    // 상품 변경 처리
    const handleProductChange = (index, field, value) => {
        const updatedProducts = [...products];
        updatedProducts[index][field] = value || 0;
        setProducts(updatedProducts);
    };

    // 상품 수정 처리
    const handleProductEdit = (index, field, value) => {
        const updatedOrderDetails = [...orderDetails];
        updatedOrderDetails[index][field] = value || 0;
        setOrderDetails(updatedOrderDetails);
    };

    const openModal = (index) => {
        setSelectedProductIndex(index);
        setShowModal(true);
        setSearchQuery('');
        setSearchCode('');
        handleSearch();
    };

    // 모달 닫기
    const closeModal = () => {
        setShowModal(false);
    };

    // Customer 모달 열기
    const openCustomerModal = () => {
        setCustomerModalOpen(true);
        setSearchQuery('');
        customerSearch(); // 전체 고객사 목록을 불러오는 함수 호출
    };

    // Customer 모달 닫기
    const closeCustomerModal = () => {
        setCustomerModalOpen(false);
    };


    // // 상품 검색 처리
    // const handleSearch = async () => {
    //     console.log("-------------------------------------handleSearch");
    //     try {
    //         const response = await fetch(`/api/order/search?productCd=${searchCode}&productNm=${searchQuery}`);
    //         if (!response.ok) throw new Error('검색 결과가 없습니다.');
    //         const data = await response.json();
    //         setSearchResults(data);
    //         setCurrentPageProduct(1); // 검색 시 페이지를 첫 페이지로 초기화
    //     } catch (error) {
    //         console.error('검색 중 오류 발생:', error);
    //         setSearchResults([]);
    //     }
    // };

    const handleSearch = async () => {
        console.log("-------------------------------------handleSearch");

        // URL에 포함할 쿼리 파라미터 생성
        const params = new URLSearchParams({
            productCd: searchCode,
            productNm: searchQuery,
            topCategory: selectedCategory.top,
            middleCategory: selectedCategory.middle,
            lowCategory: selectedCategory.low
        });

        try {
            const response = await fetch(`/api/order/search?${params.toString()}`);
            if (!response.ok) throw new Error('검색 결과가 없습니다.');
            const data = await response.json();
            setSearchResults(data);
            setCurrentPageProduct(1); // 검색 시 페이지를 첫 페이지로 초기화
        } catch (error) {
            console.error('검색 중 오류 발생:', error);
            setSearchResults([]);
        }
    };



    //고객사 서치
    const customerSearch = async () => {
        console.log("-------------------------------------customerSearch");
        try {
            const response = await fetch(`/api/customer/search?name=${encodeURIComponent(searchQuery)}`);
            if (!response.ok) throw new Error('검색 결과가 없습니다.');
            const data = await response.json();
            setCustomerSearchResults(data);
            setCurrentPageCustomer(1); // 검색 시 페이지를 첫 페이지로 초기화
        } catch (error) {
            console.error('검색 중 오류 발생:', error);
            setCustomerSearchResults([]);
        }
    };




    // 상품 선택 처리
    const handleProductSelect = (selectedProduct) => {
        console.log('Selected product:', selectedProduct);

        if (selectedProductIndex !== null) {
            const updatedProducts = [...products];
            // 선택된 상품의 필드가 null인 경우 기본값 0으로 대체
            updatedProducts[selectedProductIndex] = {
                ...selectedProduct,
                name: selectedProduct.productNm,
                price: selectedProduct.price || 0,
                quantity: selectedProduct.quantity || 0,
                code: selectedProduct.productCd // 상품 코드를 추가
            };
            console.log('Updated products:', updatedProducts);
            console.log('Updated product codes:', updatedProducts.map(product => product.code));
            setProducts(updatedProducts);
        } else {
            console.error('No selectedProductIndex set');
        }
        closeModal();
    };


    //수정시 상품 선택
    const handleProductSelectEdit = (selectedProduct) => {
        console.log('Selected product:', selectedProduct);

        if (selectedProductIndex !== null) {
            const updatedOrderDetails = [...orderDetails];
            updatedOrderDetails[selectedProductIndex] = {
                ...updatedOrderDetails[selectedProductIndex],
                productNm: selectedProduct.productNm || '', // 제품 이름을 업데이트
                orderDPrice: selectedProduct.price || 0,
                orderDQty: selectedProduct.quantity || 0,
                productCd: selectedProduct.productCd || '' // 상품 코드
            };

            console.log('Updated order details:', updatedOrderDetails);
            setOrderDetails(updatedOrderDetails);
        } else {
            console.error('No selectedProductIndex set');
        }
        closeModal();
    };






    //주문 생성 및 정보 직관화 한 alert 생성
    const handleSubmit = async () => {
        const customerName = document.querySelector('input[name="customerName"]').value.trim();
        const employeeElement = document.querySelector('.employee-name');
        const employeeName = employeeElement ? employeeElement.textContent.trim() : "담당자 이름 없음";
        const customerNo = document.querySelector('input[name="customerNo"]').value.trim();
        const totalAmount = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
        const employeeIdElement = document.querySelector('.employee-id');
        const employeeId = employeeIdElement ? employeeIdElement.textContent.trim() : null;

        console.log(customerNo);
        console.log(employeeId);
        console.log(totalAmount);

        const orderData = {
            customer: { customerNo: customerNo },
            employee: { employeeId: employeeId },
            orderHTotalPrice: totalAmount,
            orderHStatus: "ing",
            orderHInsertDate: new Date().toISOString(),
            orderHUpdateDate: null,
            orderHDeleteYn: "N"
        };

        console.log("-------------------------------------handleSubmit");
        try {
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const data = await response.json();
                const order_h_no = data.orderNo;

                console.log("order_h_no : " + order_h_no);

                // 제품별 상세 주문 정보를 서버에 전송
                for (let product of products) {
                    const deliveryDateElement = document.querySelector('.delivery-date');
                    const deliveryRequestDate = deliveryDateElement ? deliveryDateElement.value : null;

                    const orderDetailData = {
                        orderNo: order_h_no,
                        productCd: product.code,
                        orderDPrice: product.price,
                        orderDQty: product.quantity,
                        orderDTotalPrice: product.price * product.quantity,
                        orderDDeliveryRequestDate: deliveryRequestDate,
                    };

                    const detailResponse = await fetch('/api/orderDetails', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(orderDetailData),
                    });

                    if (!detailResponse.ok) {
                        const errorText = await detailResponse.text();
                        throw new Error(`상세 주문 처리 중 오류 발생: ${errorText}`);
                        alert("주문 처리 중 오류가 발생했습니다. 다시 확인해주세요");
                    }
                }

                // 상품이 두 개 이상일 때 첫 번째 상품과 나머지 상품 수 계산
                const firstProduct = products[0];
                const additionalProductsCount = products.length > 1 ? products.length - 1 : 0;

                // 첫 번째 상품과 나머지 상품 수를 포함하여 알림 메시지 생성
                const summaryString = additionalProductsCount > 0
                    ? `제품명: ${firstProduct.name} 외 ${additionalProductsCount}건\n총 수량: ${products.reduce((sum, product) => sum + product.quantity, 0)}개\n총액: ${totalAmount.toLocaleString()}원`
                    : `제품명: ${firstProduct.name}\n수량: ${firstProduct.quantity.toLocaleString()}개\n단가: ${firstProduct.price.toLocaleString()}원\n금액: ${(firstProduct.price * firstProduct.quantity).toLocaleString()}원`;

                // 요약된 알림 생성
                alert(`${employeeName}님의 주문 생성이 완료되었습니다.\n\n주문번호: ${order_h_no}\n고객사: ${customerName}\n\n${summaryString}`);

                // 주문 처리 후 페이지 이동
                window.location.href = `/order?no=${order_h_no}`;
            } else {
                const errorText = await response.text();
                console.error('주문 처리 오류:', errorText);
                alert("주문 처리 중 오류가 발생했습니다. 다시 확인해주세요");

            }
        } catch (error) {
            console.error('주문 처리 중 오류 발생:', error.message);
            alert("주문 처리 중 오류가 발생했습니다. 다시 확인해주세요");

        }
    };





    //수정
    const handleEdit = async (orderNo) => {
        // 상태에서 관리하는 값을 사용 (DOM에서 직접 가져오는 대신)
        const customerNo = document.querySelector('input[name="customerNo"]').value.trim(); // 고객번호
        const totalAmount = products.reduce((sum, product) => sum + product.price * product.quantity, 0); // 총 금액
        const employeeIdElement = document.querySelector('.employee-id');
        const employeeId = employeeIdElement ? employeeIdElement.textContent.trim() : null; // 담당자의 ID

        // 업데이트할 주문 데이터
        const orderData = {
            orderNo: orderNo, // 기존의 orderNo를 그대로 사용 (주문 수정)
            customer: { customerNo: customerNo },  // 서버에서 기대하는 Customer 객체
            employee: { employeeId: employeeId },  // 서버에서 기대하는 Employee 객체
            orderHTotalPrice: totalAmount,
            orderHStatus: "ing", // 주문 상태 업데이트 (필요시 변경 가능)
            orderHUpdateDate: new Date().toISOString(), // 업데이트 날짜를 현재로 설정
            orderHDeleteYn: "N" // 삭제되지 않은 상태로 유지
        };

        try {
            const response = await fetch(`/api/order/${orderNo}`, { // PUT 요청으로 기존 주문 수정
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                // 서버 응답에서 데이터 확인
                const data = await response.json();
                const updatedOrderNo = data.orderNo; // 업데이트된 orderNo 확인

                console.log("updatedOrderNo : " + updatedOrderNo);

                // 제품별로 상세 주문 정보 업데이트
                for (let product of products) {
                    const deliveryDateElement = document.querySelector('.delivery-date');
                    const deliveryRequestDate = deliveryDateElement ? deliveryDateElement.value : null;

                    const orderDetailData = {
                        orderNo: updatedOrderNo, // 해당 주문 번호로 연결된 상세 주문 정보
                        productCd: product.code, // 상품 코드
                        orderDPrice: product.price,
                        orderDQty: product.quantity,
                        orderDTotalPrice: product.price * product.quantity,
                        orderDDeliveryRequestDate: deliveryRequestDate,
                    };

                    // PUT 요청으로 각 제품의 상세 정보 업데이트
                    const detailResponse = await fetch(`/api/orderDetails/${product.detailId}`, { // 각 제품의 detailId로 PUT 요청
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(orderDetailData),
                    });

                    if (!detailResponse.ok) {
                        const errorText = await detailResponse.text();
                        throw new Error(`상세 주문 처리 중 오류 발생: ${errorText}`);
                    }
                }

                // 주문 수정 후 페이지 이동
                window.location.href = '/orderListAll';
            } else {
                const errorText = await response.text();
                console.error('주문 수정 오류:', errorText);
            }
        } catch (error) {
            console.error('주문 수정 중 오류 발생:', error.message);
        }
    };




    const handleCustomerSelect = (selectedCustomer) => {
        // 선택된 고객 정보 처리
        console.log('Selected customer:', selectedCustomer);
        // 예를 들어, 고객 번호를 폼에 설정할 수 있습니다.
        document.querySelector('input[name="customerNo"]').value = selectedCustomer.customerNo;
        document.querySelector('input[name="customerName"]').value = selectedCustomer.customerName;
        document.querySelector('input[name="customerAddr"]').value = selectedCustomer.customerAddr;
        document.querySelector('input[name="customerTel"]').value = selectedCustomer.customerTel;
        document.querySelector('input[name="customerRepresentativeName"]').value = selectedCustomer.customerRepresentativeName;
        closeCustomerModal();
    };


    //날짜 형식 처리
    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {  // 날짜가 유효하지 않으면
            console.error('유효하지 않은 날짜:', dateString);
            return '';  // 또는 기본값으로 빈 문자열 반환
        }
        return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
    };

    const formattedDate = isCreateMode ? '' : formatDateForInput(customer.customerInsertDate);


    return (
        <Layout currentMenu="order">
            <main className="main-content menu_order">
            <div className="orderDetail-title">
                <h3>{isCreateMode ? '주문 등록' : isEditMode ? '주문 수정' : '주문 상세보기'}</h3>
            </div>
            <div className="order-detail-container">
                <div className="form-row">
                    {orderNo && (
                        <div className="form-group">
                            <label>주문번호</label>
                            <input type="text" value={orderNo} readOnly className="readonly"/>
                        </div>
                    )}

                    <div className="form-group">
                        <label>고객사</label>
                        <input type="hidden" name="customerNo" readOnly/>
                        {/*위는 주문 생성 , 아래는 수정과 변경*/}
                        <input type="text" name="customerName"  style={{display: isCreateMode ? 'block' : 'none'}}/>
                        <input type="text" name="customerNamex" value={isCreateMode ? '' : customer.customerName}
                               style={{display: isCreateMode ? 'none' : 'block'}} readOnly/>

                        <button
                            className="search-button"
                            onClick={openCustomerModal}
                            style={{display: !isEditMode && !isCreateMode ? 'none' : 'block'}}
                        >
                            <i className="bi bi-search"></i>
                        </button>
                    </div>

                    {!isCreateMode && (
                        <>
                            <div className="form-group">
                                <label>물품 총액</label>
                                <span className="orderHtotal-price"> {orderHTotalPrice.toLocaleString()}원</span>
                            </div>
                            <div className="form-group">
                                <label>주문 등록일</label>
                                <input type="date" value={formatDateForInput(orderHInsertDate) || ''} readOnly className="readonly"/>

                            </div>
                        </>
                    )}


                    <div className="form-group">
                        {/*위는 주문 생성 , 아래는 수정과 변경*/}
                        <label>납품요청일</label>
                        <input type="date" className="delivery-date" defaultValue="2024-10-07"
                               readOnly={!isEditMode && !isCreateMode} style={{display: isCreateMode ? 'block' : 'none'}}/>
                        <input
                            type="date"
                            value={formattedDate}
                            readOnly
                            style={{display: isCreateMode ? 'none' : 'block'}}
                            name="delivery-datex"
                        />
                    </div>

                    <div className="form-group">
                        <label>담당자</label>
                        <span className="employee-id" style={{display: 'none'}}>{employee ? (
                            <>
                                {employee.employeeId}
                            </>
                        ) : (
                            'LOADING'
                        )}</span>
                        <span className="employee-name">{employee ? (
                            <>
                                {employee.employeeName}
                            </>
                        ) : (
                            'LOADING'
                        )}


                        </span>
                    </div>
                    <div className="form-group">
                        <label>주소</label>

                        <input type="text" name="customerAddr" style={{display: isCreateMode ? 'block' : 'none'}} readOnly/>

                        <input type="text" name="customerAddrx" value={isCreateMode ? '' : customer.customerAddr}
                               style={{display: isCreateMode ? 'none' : 'block'}}
                               readOnly/>
                    </div>

                    <div className="form-group">
                        <label>연락처</label>
                        <input type="text" name="customerTel" style={{display: isCreateMode ? 'block' : 'none'}} readOnly/>
                        <input type="text" name="customerTelx" value={isCreateMode ? '' : customer.customerTel}
                               style={{display: isCreateMode ? 'none' : 'block'}} readOnly/>

                    </div>

                    <div className="form-group">
                        <label>대표명</label>
                        <input type="text" name="customerRepresentativeName" style={{display: isCreateMode ? 'block' : 'none'}} readOnly/>
                        <input type="text" name="customerRepresentativeNamex"
                               value={isCreateMode ? '' : customer.customerRepresentativeName}
                               style={{display: isCreateMode ? 'none' : 'block'}}
                               readOnly/>
                    </div>


                    <div
                        className="form-group"
                        style={{display: isCreateMode ? 'none' : 'block'}}
                    >
                        <label>주문 상태</label>
                        <span style={{display: 'none'}} className="order-status"></span>
                    </div>
                </div>

                {/* 주문 생성시 보이는 제품 목록 (선택 및 등록 구현 완료) */}
                {isCreateMode && (
                <div className="product-table">
                    <table className="styled-table">
                        <thead>
                        <tr>
                            <th>상품번호</th>
                            <th>상품명</th>
                            <th>단가</th>
                            <th>수량</th>
                            <th>총 금액</th>
                            {(isCreateMode) && <th>삭제</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {(isCreateMode ? products : orderDetails).map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={isCreateMode ? item.name : item.product.name}
                                        readOnly={!isEditMode && !isCreateMode}
                                        onChange={(e) => isCreateMode
                                            ? handleProductChange(index, 'name', e.target.value)
                                            : null
                                        }
                                    />
                                    {(isCreateMode || isEditMode) && (
                                        <button className="search-button" onClick={() => openModal(index)}>
                                            <i className="bi bi-search"></i>
                                        </button>
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={isCreateMode ? (item.price || '') : (item.orderDPrice || '')} // 기본값을 0으로 설정
                                        readOnly={!isEditMode && !isCreateMode}
                                        onChange={(e) => isCreateMode
                                            ? handleProductChange(index, 'price', Number(e.target.value))
                                            : null
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={isCreateMode ? (item.quantity || 0) : (item.orderDQty || 0)} // 기본값을 0으로 설정
                                        readOnly={!isEditMode && !isCreateMode}
                                        onChange={(e) => isCreateMode
                                            ? handleProductChange(index, 'quantity', Number(e.target.value))
                                            : null
                                        }
                                    />
                                </td>
                                <td>{(isCreateMode ? (item.price * item.quantity).toLocaleString() : item.orderDPrice * item.orderDQty) || 0}</td>
                                {(isCreateMode || isEditMode) && (

                                    <td>
                                        <button onClick={() => removeProductRow(index)}>&times;</button>
                                    </td>
                                )}
                                {/* 숨겨진 상품 코드 */}
                                <td style={{display: 'none'}}>
                                    <input type="text" value={isCreateMode ? item.code : item.product.code || ''} readOnly/>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {(isCreateMode) &&
                        <button className="add-button" onClick={addProductRow}>+</button>}
                </div>
                )}

                {/* 상세 기능 구현완료.... 죽여줘 */}
                {!(isCreateMode || isEditMode) && (
                    <div className="product-table">
                        <table className="styled-table">
                            <thead>
                            <tr>
                                <th>상품번호</th>
                                <th>상품명</th>
                                <th>단가</th>
                                <th>수량</th>
                                <th>총 금액</th>
                                {isEditMode && <th>삭제</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {displayItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={item.productNm}
                                            readOnly={!isEditMode}
                                            onChange={(e) => isEditMode
                                                ? handleProductChange(index, 'productNm', e.target.value)
                                                : null
                                            }
                                        />
                                        {isEditMode && (
                                            <button className="search-button" onClick={() => openModal(index)}>
                                                <i className="bi bi-search"></i>
                                            </button>
                                        )}
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.orderDPrice}
                                            readOnly={!isEditMode}
                                            onChange={(e) => isEditMode
                                                ? handleProductChange(index, 'orderDPrice', Number(e.target.value))
                                                : null
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.orderDQty}
                                            readOnly={!isEditMode}
                                            onChange={(e) => isEditMode
                                                ? handleProductChange(index, 'orderDQty', Number(e.target.value))
                                                : null
                                            }
                                        />
                                    </td>
                                    <td>{(item.orderDPrice * item.orderDQty).toLocaleString()}</td>
                                    {isEditMode && (
                                        <td>
                                            <button onClick={() => removeProductRow(index)}>&times;</button>
                                        </td>
                                    )}
                                    {/* 숨겨진 상품 코드 */}
                                    <td style={{ display: 'none' }}>
                                        <input type="text" value={item.productCd} readOnly />
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/*여기는 수정 모드*/}
                {isEditMode && (
                <div className="product-table">
                    <table className="styled-table">
                        <thead>
                        <tr>
                            <th>상품번호</th>
                            <th>상품명</th>
                            <th>단가</th>
                            <th>수량</th>
                            <th>총 금액</th>
                            {isEditMode && <th>삭제</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {displayItemEdit.map((item, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                    <input
                                        type="text"
                                        value={item.productNm}
                                        readOnly={!isEditMode}
                                        onChange={(e) => isEditMode
                                            ? handleProductEdit(index, 'productNm', e.target.value)
                                            : null
                                        }

                                    />
                                    {isEditMode && (
                                        <button className="search-button" onClick={() => openModal(index)}>
                                            <i className="bi bi-search"></i>
                                        </button>
                                    )}
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.orderDPrice}
                                        readOnly={!isEditMode}
                                        onChange={(e) => isEditMode
                                            ? handleProductEdit(index, 'orderDPrice', Number(e.target.value))
                                            : null
                                        }
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        value={item.orderDQty}
                                        readOnly={!isEditMode}
                                        onChange={(e) => isEditMode
                                            ? handleProductEdit(index, 'orderDQty', Number(e.target.value))
                                            : null
                                        }
                                    />
                                </td>
                                <td>{(item.orderDPrice * item.orderDQty).toLocaleString()}</td>
                                {isEditMode && (
                                    <td>
                                        <button onClick={() => removeProducteditRow(index)}>&times;</button>
                                    </td>
                                )}
                                {/* 숨겨진 상품 코드 */}
                                <td style={{ display: 'none' }}>
                                    <input type="text" value={item.productCd} readOnly />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {isEditMode && (
                        <button className="add-button" onClick={editProductRow}>+</button>
                    )}
                </div>
                )}



                {/* 고객사 검색 모달 */}
                {customerModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4>고객사 검색</h4>
                                <button className="close-modal" onClick={closeCustomerModal}>&times;</button>
                            </div>

                            <div className="search-fields">
                                <input
                                    type="text"
                                    placeholder="검색하실 고객사를 입력하세요"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="search-modal" onClick={customerSearch}>검색</button>
                            </div>

                            <div className="search-results">
                                {customerSearchResults.length > 0 ? (
                                    <table className="search-results-table">
                                        <thead>
                                        <tr>
                                            <th>고객사</th>
                                            <th>주소</th>
                                            <th>연락처</th>
                                            <th>대표명</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {paginatedCustomerSearchResults.map((result) => (
                                            <tr key={result.customerNo} onClick={() => handleCustomerSelect(result)}>
                                                <td>{result.customerName}</td>
                                                <td>{result.customerAddr}</td>
                                                <td>{result.customerTel}</td>
                                                <td>{result.customerRepresentativeName}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div>검색 결과가 없습니다.</div>
                                )}
                                {/* 페이지네이션 */}
                                <div className="pagination">
                                    {Array.from({ length: totalCustomerPages }, (_, i) => i + 1).map(number => (
                                        <button
                                            key={number}
                                            onClick={() => handlePageChangeCustomer(number)}
                                            className={number === currentPageCustomer ? 'active' : ''}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* 상품 검색 모달 */}
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4>상품 검색</h4>
                                <button className="close-modal" onClick={closeModal}>&times;</button>
                            </div>

                            <div className="category-selectors">
                                <select value={selectedCategory.top} onChange={handleTopChange}>
                                    <option value="">대분류</option>
                                    {categories.topCategories.map(category => (
                                        <option key={category.categoryNo}
                                                value={category.categoryNo}>{category.categoryNm}</option>
                                    ))}
                                </select>

                                <select value={selectedCategory.middle} onChange={handleMiddleChange}
                                        disabled={!selectedCategory.top}>
                                    <option value="">중분류</option>
                                    {categories.middleCategories.map(category => (
                                        <option key={category.categoryNo}
                                                value={category.categoryNo}>{category.categoryNm}</option>
                                    ))}
                                </select>

                                <select value={selectedCategory.low} onChange={(e) => setSelectedCategory({
                                    ...selectedCategory,
                                    low: e.target.value
                                })} disabled={!selectedCategory.middle}>
                                    <option value="">소분류</option>
                                    {categories.lowCategories.map(category => (
                                        <option key={category.categoryNo}
                                                value={category.categoryNo}>{category.categoryNm}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="search-fields">
                                <input
                                    type="text"
                                    placeholder="상품명"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="상품코드"
                                    value={searchCode}
                                    onChange={(e) => setSearchCode(e.target.value)}
                                />
                                <button className="search-modal" onClick={handleSearch}>검색</button>
                            </div>


                            {/* 검색 결과 */}
                            <div className="search-results">
                                {searchResults.length > 0 ? (
                                    <table className="search-results-table">
                                        <thead>
                                        <tr>
                                            <th>상품코드</th>
                                            <th>카테고리</th>
                                            <th>상품명</th>
                                            <th>가격</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {paginatedSearchResults.map((result, index) => (
                                            <tr
                                                key={index}
                                                onClick={() => isEditMode ? handleProductSelectEdit(result) : handleProductSelect(result)}
                                            >
                                                <td>{result.productCd}</td>
                                                <td>{result.category.categoryNo}</td>
                                                <td>{result.productNm}</td>
                                                <td>{result.price}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div>검색 결과가 없습니다.</div>
                                )}
                                {/* 페이지네이션 */}
                                <div className="pagination">
                                    {Array.from({length: totalProductPages}, (_, i) => i + 1).map(number => (
                                        <button
                                            key={number}
                                            onClick={() => handlePageChangeProduct(number)}
                                            className={number === currentPageProduct ? 'active' : ''}
                                        >
                                            {number}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                <div className="total-amount">
                    {isCreateMode ? (
                        <>
                            <label>총 금액: </label>
                            <span>{(products.reduce((sum, product) => sum + product.price * product.quantity, 0)).toLocaleString()}원</span>
                        </>
                    ) : (
                        <span></span>
                    )}
                </div>

                <div className="order-buttons">
                    {isCreateMode && <button onClick={handleSubmit}>주문 등록</button>}
                    {isEditMode && <button onClick={handleEdit}>주문 수정</button>}
                    {isDetailView &&
                        <button onClick={() => window.location.href = `/order?no=${orderNo}&mode=edit`}>수정</button>}
                    <button className="close-btn" onClick={() => window.location.href = '/orderListAll'}>닫기</button>
                </div>
            </div>
            </main>
        </Layout>
    );
}


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <Order/>
    </BrowserRouter>
);