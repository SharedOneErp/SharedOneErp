// src/main/react/components/sales/OrderHooks.js
import { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";

export const useHooksList = () => {

    const [searchParams] = useSearchParams();
    const orderNo = searchParams.get('no'); // 주문번호
    const mode = searchParams.get('mode') || 'view'; // 'edit' 또는 'view'

    // 등록/수정/상세 구분
    const isCreateMode = !orderNo; // 주문번호 없으면 등록 모드
    const isEditMode = mode === 'edit'; // 수정 모드
    const isDetailView = !!orderNo && mode === 'view'; // 상세보기 모드

    // 🔴 useState : 상태 정의 및 초기화
    const [products, setProducts] = useState([{ name: '', price: '', quantity: '' }]);
    const [customer, setCustomer] = useState([]);

    const [orderDetails, setOrderDetails] = useState([{
        orderNo: '', // 주문 상세 ID
        productNm: '', // 제품명
        orderDPrice: '', // 주문 가격
        orderDQty: '', // 주문 수량
        productCd: '', // 제품 코드
        orderDDeliveryRequestDate: ''
    }]);
    const [showModal, setShowModal] = useState(false); // 모달 상태
    const [customerModalOpen, setCustomerModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''); // 검색어 상태
    const [searchCode, setSearchCode] = useState(''); // 상품코드 상태
    const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
    const [customerSearchResults, setCustomerSearchResults] = useState([]); // 고객 검색 결과
    const [orderHTotalPrice, setOrderHTotalPrice] = useState(0);
    const [orderHInsertDate, setOrderHInsertDate] = useState(0);
    const [customerNo, setCustomerNo] = useState('');
    const [employeeId, setEmployeeId] = useState('');

    const [customerData, setCustomerData] = useState({
        customerNo: '',
        customerName: '',
        customerAddr: '',
        customerTel: '',
        customerRepresentativeName: ''
    });

    //날짜
    const [todayDate, setTodayDate] = useState('');

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

    const [deliveryDate, setDeliveryDate] = useState('');

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

    // 🟡 useEffect
    useEffect(() => {
        setCustomerData(customer || {});
    }, [customer]);

    // 🟡 useEffect
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

    // 🟡 useEffect : 사용자 정보를 서버에서 가져오는 useEffect
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


    // 🟡 useEffect : 주문 상세 정보 가져오기 (상세보기/수정용)
    useEffect(() => {
        if (orderNo) {
            fetchOrderDetail(orderNo);
        }
    }, [orderNo]);

    // 🟡 useEffect
    useEffect(() => {
        // 오늘 날짜를 yyyy-mm-dd 형식으로 계산
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1
        const day = today.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}-${month}-${day}`;

        setTodayDate(formattedDate);
        setDeliveryDate(formattedDate); // 기본값을 설정
    }, []);

    // 🟡 useEffect
    useEffect(() => {
    }, [orderDetails]);

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
            orderNo: orderDetail.orderNo, // orderDNo를 detailId로 설정
            productCd: orderDetail.productCd,
            productNm: matchingProduct ? matchingProduct.productNm : '',
            orderDPrice: orderDetail.orderDPrice,
            orderDQty: orderDetail.orderDQty,
            orderDTotalPrice: orderDetail.orderDTotalPrice,
            orderDDeliveryRequestDate: orderDetail.orderDDeliveryRequestDate,
        };
    });

    const displayItemEdit = orderDetails.map(orderDetail => {
        // productCd를 기준으로 products에서 해당 제품을 찾음
        const matchingProduct = products.find(product => product.productCd === orderDetail.productCd);

        return {
            orderNo: orderDetail.orderNo,
            productCd: orderDetail.productCd,
            productNm: matchingProduct ? matchingProduct.productNm : orderDetail.productNm, // 기본값으로 orderDetail.productNm 사용
            orderDPrice: orderDetail.orderDPrice,
            orderDQty: orderDetail.orderDQty,
            orderDTotalPrice: orderDetail.orderDTotalPrice,
            orderDDeliveryRequestDate: orderDetail.orderDDeliveryRequestDate,
        };
    });

    const fetchOrderDetail = async (orderNo) => {

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

        } catch (error) {
            console.error('주문 정보를 가져오는 중 오류가 발생했습니다.', error);
        }
    };

    // 상품 행 추가
    const addProductRow = () => {
        setProducts([...products, { name: '', price: 0, quantity: 0 }]);
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
        updatedOrderDetails[index][field] = value;
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


    const handleSearch = async () => {
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
            setProducts(updatedProducts);
        } else {
            console.error('handleProductSelect error');
        }
        closeModal();
    };

    //수정시 상품 선택
    const handleProductSelectEdit = (selectedProduct) => {

        if (selectedProductIndex !== null) {
            const updatedOrderDetails = [...orderDetails];
            updatedOrderDetails[selectedProductIndex] = {
                ...updatedOrderDetails[selectedProductIndex],
                productNm: selectedProduct.productNm || '', // 제품 이름을 업데이트
                orderDPrice: selectedProduct.price || 0,
                orderDQty: selectedProduct.quantity || 0,
                productCd: selectedProduct.productCd || '' // 상품 코드
            };

            setOrderDetails(updatedOrderDetails);
        } else {
            console.error('handleProductSelectEdit error');
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

        const orderData = {
            customer: { customerNo: customerNo },
            employee: { employeeId: employeeId },
            orderHTotalPrice: totalAmount,
            orderHStatus: "ing",
            orderHInsertDate: new Date().toISOString(),
            orderHUpdateDate: null,
            orderHDeleteYn: "N"
        };

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
                    const deliveryRequestDate = deliveryDateElement ? formatDateForInput(deliveryDateElement.value) : null;

                    console.log("deliveryRequestDate:", deliveryRequestDate);

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

    // 주문 수정
    const handleEdit = async (orderNo) => {
        try {
            // 1. 전체 금액 계산
            const totalAmount = displayItemEdit.reduce((sum, product) => sum + product.orderDPrice * product.orderDQty, 0);

            console.log("Display Item Edit before cleaning: ", displayItemEdit);

            // 2. 주문 데이터 준비
            const cleanProducts = displayItemEdit.map((product) => ({
                orderNo: product.orderNo,
                productCd: product.productCd,
                orderDPrice: product.orderDPrice,
                orderDQty: product.orderDQty,
                orderDTotalPrice: product.orderDPrice * product.orderDQty,
                orderDDeliveryRequestDate: product.orderDDeliveryRequestDate,
            }));

            console.log("Clean Products: ", cleanProducts);

            const customerNo = document.querySelector('input[name="customerNo"]').value.trim();
            const employeeId = document.querySelector('.employee-id').textContent.trim();

            const orderData = {
                orderNo: orderNo,
                customer: { customerNo: customerNo },
                employee: { employeeId: employeeId },
                orderHTotalPrice: totalAmount,
                orderHStatus: "ing",
                orderHUpdateDate: new Date().toISOString(),
                orderHDeleteYn: "N"
            };

            console.log("Order Data:", JSON.stringify(orderData));

            // 3. 주문 데이터 업데이트 API 호출
            const response = await fetch(`/api/order/${orderNo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`주문 수정 오류: ${errorText}`);
            }

            const data = await response.json();
            const updatedOrderNo = data.orderNo;

            console.log("Updated Order No: " + updatedOrderNo);

            // 4. 주문 상세 정보 업데이트
            for (let product of cleanProducts) {
                const orderDetailData = {
                    orderNo: updatedOrderNo,
                    productCd: product.productCd,
                    orderDPrice: product.orderDPrice,
                    orderDQty: product.orderDQty,
                    orderDTotalPrice: product.orderDTotalPrice,
                    orderDDeliveryRequestDate: product.orderDDeliveryRequestDate,
                };

                if (product.orderNo) {
                    const detailResponse = await fetch(`/api/orderDetails/${product.orderNo}`, {
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
                } else {
                    // 주문 상세 항목 추가 로직
                    const detailResponse = await fetch(`/api/orderDetails`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(orderDetailData),
                    });

                    if (!detailResponse.ok) {
                        const errorText = await detailResponse.text();
                        throw new Error(`상세 주문 추가 중 오류 발생: ${errorText}`);
                    }
                }
            }

            // 5. 성공 후 페이지 이동
            alert("주문을 성공적으로 수정했습니다.");
            window.location.href = `/orderList`;
        } catch (error) {
            console.error('주문 수정 중 오류 발생:', error.message);
            alert("주문 수정 중 오류가 발생했습니다. 다시 확인해주세요");
        }
    };


    const handleCustomerSelect = (selectedCustomer) => {
        console.log('Selected customer:', selectedCustomer);

        setCustomerData({
            customerNo: selectedCustomer.customerNo,
            customerName: selectedCustomer.customerName,
            customerAddr: selectedCustomer.customerAddr,
            customerTel: selectedCustomer.customerTel,
            customerRepresentativeName: selectedCustomer.customerRepresentativeName
        });
        closeCustomerModal();
    };

    //날짜 형식 처리
    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {  // 날짜가 유효하지 않으면
            return '';  // 또는 기본값으로 빈 문자열 반환
        }
        return date.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 변환
    };

    const formattedDate = isCreateMode ? '' : formatDateForInput(customer.customerInsertDate);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {  // 날짜가 유효하지 않으면
            console.error('유효하지 않은 날짜:', dateString);
            return '';  // 또는 기본값으로 빈 문자열 반환
        }
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // YYYY-MM-DD 형식으로 변환
    };

    return {
        // 주문 모드 관련 상태
        isCreateMode,  // 현재 주문이 등록 모드인지 확인
        isEditMode,    // 현재 주문이 수정 모드인지 확인
        isDetailView,  // 현재 주문이 상세보기 모드인지 확인

        // 주문 번호 관련 상태
        orderNo,       // 현재 주문 번호

        // 주문 관련 데이터 및 상태
        products,           // 상품 리스트
        customerData,       // 고객사 정보
        orderDetails,       // 주문 상세 정보
        orderHTotalPrice,   // 주문 총액
        orderHInsertDate,   // 주문 등록일
        deliveryDate,       // 납품 요청일
        employee,           // 담당자 정보 (로그인한 사용자 정보)

        // 모달 관련 상태 및 함수
        showModal,              // 상품 검색 모달 상태
        customerModalOpen,      // 고객사 검색 모달 상태
        openModal,              // 상품 검색 모달 열기
        closeModal,             // 상품 검색 모달 닫기
        openCustomerModal,      // 고객사 검색 모달 열기
        closeCustomerModal,     // 고객사 검색 모달 닫기
        handleCustomerSelect,   // 고객사 선택 처리 함수

        // 검색 관련 상태 및 함수
        searchQuery,            // 검색어 상태 (상품명 검색어)
        setSearchQuery,         // 검색어 상태 설정 함수
        searchCode,             // 상품 코드 검색어 상태
        setSearchCode,          // 상품 코드 검색어 상태 설정 함수
        handleSearch,           // 상품 검색 처리 함수
        customerSearch,         // 고객사 검색 처리 함수
        searchResults,          // 상품 검색 결과
        customerSearchResults,  // 고객사 검색 결과

        // 상품 및 주문 상세 데이터 변경 함수
        handleProductChange,    // 상품 데이터 변경 처리 함수 (등록 시)
        handleProductEdit,      // 상품 수정 데이터 변경 처리 함수 (수정 시)
        addProductRow,          // 상품 행 추가 함수
        removeProductRow,       // 상품 행 제거 함수
        removeProducteditRow,   // 상품 수정 행 제거 함수
        handleProductSelect,    // 상품 선택 처리 함수 (등록 시)
        handleProductSelectEdit,// 상품 수정 시 선택 처리 함수

        // 페이지네이션 관련 상태 및 함수
        currentPageProduct,         // 상품 모달의 현재 페이지 상태
        setCurrentPageProduct,      // 상품 모달의 현재 페이지 상태 설정 함수
        handlePageChangeProduct,    // 상품 모달의 페이지 변경 처리 함수
        currentPageCustomer,        // 고객사 모달의 현재 페이지 상태
        setCurrentPageCustomer,     // 고객사 모달의 현재 페이지 상태 설정 함수
        handlePageChangeCustomer,   // 고객사 모달의 페이지 변경 처리 함수
        paginatedSearchResults,     // 페이지네이션된 상품 검색 결과
        paginatedCustomerSearchResults, // 페이지네이션된 고객사 검색 결과
        totalProductPages,          // 상품 검색 결과의 총 페이지 수
        totalCustomerPages,         // 고객사 검색 결과의 총 페이지 수

        // 주문 생성 및 수정 함수
        handleSubmit,   // 주문 생성 처리 함수
        handleEdit,     // 주문 수정 처리 함수

        // 날짜 관련 함수
        formatDateForInput,  // 날짜를 yyyy-mm-dd 형식으로 변환하는 함수

        // 카테고리 선택 관련 상태 및 함수
        selectedCategory,      // 선택된 카테고리 (대분류, 중분류, 소분류)
        setSelectedCategory,   // 카테고리 선택 상태 설정 함수
        handleTopChange,       // 대분류 카테고리 변경 처리 함수
        handleMiddleChange,    // 중분류 카테고리 변경 처리 함수
        categories,            // 카테고리 데이터 (대분류, 중분류, 소분류)

        displayItems,
        editProductRow,
        displayItemEdit,
    };

};