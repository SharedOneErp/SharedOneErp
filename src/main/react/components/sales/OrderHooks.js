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
    const isResubmitMode = mode ==='resubmit';
    const [order, setOrder] = useState({});  // 주문 정보를 상태로 관리
    const [deletedDetailIds, setDeletedDetailIds] = useState([]);  // 삭제된 제품의 detailId 저장
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
    const [orderHStatus, setOrderHStatus] = useState('');
    const [orderHTotalPrice, setOrderHTotalPrice] = useState(0);
    const [orderHInsertDate, setOrderHInsertDate] = useState(0);
    const [customerNo, setCustomerNo] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    let isSubmitting = false;


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

    //주문 데이터 가져오기 (orderDetail)
    const fetchOrderDetail = async (orderNo) => {

        try {
            const response = await fetch(`/api/order?no=${orderNo}`);
            if (!response.ok) throw new Error('주문 데이터를 가져올 수 없습니다.');
            const data = await response.json();
            setOrderDetails(data.orderDetails || []);
            setProducts(data.products || []);
            setEmployee(data.employee || null);
            setCustomer(data.customer || {});
            setOrderHStatus(data.orderHStatus || 'LOADING');
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
        console.log('Order details before removal:', orderDetails);
        const orderDetailToDelete = orderDetails[index]; // 삭제할 주문 상세 정보

        if (orderDetailToDelete && orderDetailToDelete.orderNo) {
            handleDeleteProduct(orderDetailToDelete.orderNo); // 삭제할 제품 ID 추가
        }

        const newOrderDetails = orderDetails.filter((_, i) => i !== index); // 새로운 주문 상세 목록
        setOrderDetails(newOrderDetails); // 상태 업데이트
        console.log('Order details after removal:', newOrderDetails);
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

    //주문 생성
    const handleSubmit = async () => {

        // if (isSubmitting) return; // 이미 처리 중이면 중지
        isSubmitting = true; // 처리 중 상태로 변경

        // 입력값 검증
        const customerName = document.querySelector('input[name="customerName"]').value.trim();
        const deliveryDateElement = document.querySelector('.delivery-date');
        const deliveryRequestDate = deliveryDateElement ? formatDateForInput(deliveryDateElement.value) : null;

        // 정보값 검증
        if (!customerName) {
            window.showToast("고객 이름을 입력하세요.", 'error');
            return; // 제출 중지
        }
        if (!deliveryRequestDate) {
            window.showToast("납품 날짜를 입력하세요.", 'error');
            return; // 제출 중지
        }

        // 제품 검증
        for (let product of products) {
            if (!product.code || !product.price || !product.quantity) {
                window.showToast("모든 제품 정보가 입력되어야 합니다.", 'error');
                return; // 제출 중지
            }
        }

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


                // 제품별 상세 주문 데이터를 배열로 작성
                const orderDetailData = products.map((product) => ({
                    orderNo: order_h_no,
                    productCd: product.code,
                    orderDPrice: product.price,
                    orderDQty: product.quantity,
                    orderDTotalPrice: product.price * product.quantity,
                    orderDDeliveryRequestDate: deliveryRequestDate,
                    orderDInsertDate: new Date().toISOString(),
                }));

                console.log("Order Detail Data: ", orderDetailData); // 디버깅용 출력

                // 한 번에 주문 상세 데이터를 전송 (배치로 전송)
                const detailResponse = await fetch('/api/orderDetails/batch', {  // 서버의 '/batch' 엔드포인트로 가정
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

                // 요약된 알림 생성
                const firstProduct = products[0];
                const additionalProductsCount = products.length > 1 ? products.length - 1 : 0;
                const summaryString = additionalProductsCount > 0
                    ? `제품명: ${firstProduct.name} 외 ${additionalProductsCount}건\n총 수량: ${products.reduce((sum, product) => sum + product.quantity, 0)}개\n총액: ${totalAmount.toLocaleString()}원`
                    : `제품명: ${firstProduct.name}\n수량: ${firstProduct.quantity.toLocaleString()}개\n단가: ${firstProduct.price.toLocaleString()}원\n금액: ${(firstProduct.price * firstProduct.quantity).toLocaleString()}원`;

                // window.showToast(`${employeeName}님의 주문 생성이 완료되었습니다.\n\n주문번호: ${order_h_no}\n고객사: ${customerName}\n\n${summaryString}`);
                window.showToast(`${employeeName}님의 주문 생성이 완료되었습니다.`);
                // 2초 후에 페이지 이동 (토스트 메시지가 충분히 표시될 시간을 확보)
                setTimeout(() => {
                    window.location.href = `/order?no=${order_h_no}`;
                }, 1500); // 1500 밀리초
            } else {
                const errorText = await response.text();
                console.error('주문 처리 오류:', errorText);
                window.showToast("주문 처리 중 오류가 발생했습니다. 다시 확인해주세요", 'error');
            }
        } catch (error) {
            console.error('주문 처리 중 오류 발생:', error.message);
            window.showToast("주문 처리 중 오류가 발생했습니다. 다시 확인해주세요", 'error');
        } finally {
            isSubmitting = false; // 상태 복원
        }
    };


    // 제품 삭제 핸들러
    const handleDeleteProduct = (orderNo) => {
        console.log(`삭제할 제품 ID: ${orderNo}`); // 삭제할 제품 ID 로그
        setDeletedDetailIds(prevState => [...prevState, orderNo]); // 삭제할 제품 ID 추가
    };


    //상품 수정
    const handleEdit = async (orderNo) => {
        try {
            // 입력값 검증
            const deliveryDateElement = document.querySelector('.delivery-date');
            const deliveryRequestDate = deliveryDateElement ? formatDateForInput(deliveryDateElement.value) : null;


            if (!deliveryRequestDate) {
                window.showToast("납품 날짜를 입력하세요.", 'error');
                return; // 제출 중지
            }

            console.log('납품 요청일 (deliveryRequestDate):', deliveryRequestDate); // deliveryRequestDate 값 로그

            // 1. 전체 금액 계산
            const totalAmount = displayItemEdit.reduce((sum, product) => sum + product.orderDPrice * product.orderDQty, 0);

            // 2. 주문 데이터 준비
            const cleanProducts = displayItemEdit.map((product) => ({
                orderNo: product.orderNo,
                productCd: product.productCd,
                orderDPrice: product.orderDPrice,
                orderDQty: product.orderDQty,
                orderDTotalPrice: product.orderDPrice * product.orderDQty,
                orderDDeliveryRequestDate: deliveryRequestDate || product.orderDDeliveryRequestDate,
            }));


            console.log(cleanProducts);

            const customerNo = document.querySelector('input[name="customerNo"]').value.trim();
            const employeeId = document.querySelector('.employee-id').textContent.trim();

            const orderData = {
                orderNo: orderNo,
                customer: { customerNo: customerNo },
                employee: { employeeId: employeeId },
                orderHTotalPrice: totalAmount,
                orderHStatus: "ing",
                orderHUpdateDate: new Date().toISOString(),
                orderHDeleteYn: "N",
            };

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

            // 4. 주문 상세 정보 업데이트 및 삭제
            for (let product of cleanProducts) {
                const orderDetailData = {
                    orderNo: updatedOrderNo,
                    productCd: product.productCd,
                    orderDPrice: product.orderDPrice,
                    orderDQty: product.orderDQty,
                    orderDTotalPrice: product.orderDTotalPrice,
                    orderDUpdateDate: new Date().toISOString(),
                    orderDInsertDate: new Date().toISOString(),
                    orderDDeliveryRequestDate: deliveryRequestDate || product.orderDDeliveryRequestDate,
                };

                if (product.orderNo) {
                    // 기존 항목 업데이트
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
                    // 새로운 항목 추가
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
            //여기까지는 해결. 손대지 마시오

            // 5. 삭제된 제품 처리 전에 로그 추가
            console.log('주문 수정 시 삭제된 제품 IDs:', deletedDetailIds);



            // 5. 삭제된 제품 처리
            for (let deletedId of deletedDetailIds) {
                console.log(`삭제 요청 제품임 ID: ${deletedId}`); // 삭제할 제품 ID 로그

                const deleteResponse = await fetch(`/api/orderDetails/${deletedId}`, {
                    method: 'DELETE',
                });

                if (!deleteResponse.ok) {
                    const errorText = await deleteResponse.text();
                    throw new Error(`상세 주문 삭제 중 오류 발생: ${errorText}`);
                } else {
                    console.log(`제품 ID ${deletedId} 삭제 성공`); // 삭제 성공 로그
                }
            }

            // 6. 성공 후 페이지 이동
            window.showToast("주문을 성공적으로 수정했습니다.");
            // 2초 후에 페이지 이동 (토스트 메시지가 충분히 표시될 시간을 확보)
            setTimeout(() => {
                window.location.href = `/order?no=${orderNo}`;
            }, 1500); // 1500 밀리초
        } catch (error) {
            console.error('주문 수정 중 오류 발생:', error.message);
            window.showToast("주문 수정 중 오류가 발생했습니다. 다시 확인해주세요.", 'error');
        }
    };

    // 반려된 주문을 다시 제출
    const handleResubmit = async (orderNo) => {

        // if (isSubmitting) return; // 이미 처리 중이면 중지
        isSubmitting = true; // 처리 중 상태로 변경

        try {
            // 반려된 주문 정보 가져오기
            const deliveryDateElement = document.querySelector('.delivery-date');
            const deliveryRequestDate = deliveryDateElement ? formatDateForInput(deliveryDateElement.value) : null;

            if (!deliveryRequestDate) {
                window.showToast("납품 날짜를 입력하세요.", 'error');
                return; // 제출 중지
            }

            console.log('납품 요청일 (deliveryRequestDate):', deliveryRequestDate);

            const totalAmount = displayItemEdit.reduce((sum, product) => sum + product.orderDPrice * product.orderDQty, 0);

            const cleanProducts = displayItemEdit.map((product) => ({
                productCd: product.productCd,
                orderDPrice: product.orderDPrice,
                orderDQty: product.orderDQty,
                orderDTotalPrice: product.orderDPrice * product.orderDQty,
                orderDDeliveryRequestDate: deliveryRequestDate || product.orderDDeliveryRequestDate,
            }));

            const customerNo = document.querySelector('input[name="customerNo"]').value.trim();
            const employeeId = document.querySelector('.employee-id').textContent.trim();

            // 새로운 주문 데이터를 생성하는 부분
            const orderData = {
                customer: { customerNo: customerNo },
                employee: { employeeId: employeeId },
                orderHTotalPrice: totalAmount,
                orderHStatus: "ing", // 새 주문은 진행 중 상태로 생성
                orderHInsertDate: new Date().toISOString(),
                orderHUpdateDate: null,
                orderHDeleteYn: "N"
            };

            // 1. 새로운 주문 생성 API 호출 (handleSubmit 방식)
            const response = await fetch('/api/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const data = await response.json();
                const newOrderNo = data.orderNo;

                // 2. 새로운 주문 상세 데이터 제출
                const orderDetailData = cleanProducts.map((product) => ({
                    orderNo: newOrderNo, // 새로 생성된 주문 번호에 연결
                    productCd: product.productCd,
                    orderDPrice: product.orderDPrice,
                    orderDQty: product.orderDQty,
                    orderDTotalPrice: product.orderDTotalPrice,
                    orderDDeliveryRequestDate: product.orderDDeliveryRequestDate,
                    orderDInsertDate: new Date().toISOString(),
                }));

                const detailResponse = await fetch('/api/orderDetails/batch', {
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

                window.showToast("반려된 주문이 성공적으로 다시 제출되었습니다.");
                setTimeout(() => {
                    window.location.href = `/order?no=${newOrderNo}`;
                }, 1500);
            } else {
                const errorText = await response.text();
                console.error('주문 생성 오류:', errorText);
                window.showToast("주문 생성 중 오류가 발생했습니다.", 'error');
            }
        } catch (error) {
            console.error('결재 재요청 중 오류 발생:', error.message);
            window.showToast("결재 재요청 중 오류가 발생했습니다.", 'error');
        }finally {
            isSubmitting=false;
        }
    };





    // 주문 업데이트 시 삭제된 제품 목록을 포함하여 전송
    const updateOrder = async () => {

        window.confirmCustom("주문을 업데이트하시겠습니까?").then(result => {
            if (result) {
                const orderData = {
                    ...order,  // 기존 주문 데이터
                    deletedDetailIds: deletedDetailIds,  // 삭제할 상세 항목 ID들
                    products: products  // 현재 제품 목록을 포함
                };

                // `fetch` 요청을 `then()`과 `catch()`로 처리
                fetch(`/api/order/update/${order.orderNo}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(orderData),
                })
                    .then(response => {
                        if (response.ok) {
                            window.showToast('주문이 업데이트되었습니다.');
                        } else {
                            throw new Error('주문 업데이트 실패');
                        }
                    })
                    .catch(error => {
                        console.error('주문을 업데이트하는 중 오류 발생:', error);
                        window.showToast('주문을 업데이트하는 중 오류 발생', 'error');
                    });
            }

        });

    };

    //날짜 형식 처리
    const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return null;
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
        isResubmitMode, // 반려 주문을 수정 모드에서 등록하는지 확인

        // 주문 번호 관련 상태
        orderNo,       // 현재 주문 번호


        // 주문 관련 데이터 및 상태
        products,           // 상품 리스트
        customerData,       // 고객사 정보
        orderDetails,       // 주문 상세 정보
        orderHStatus,
        orderHTotalPrice,   // 주문 총액
        orderHInsertDate,   // 주문 등록일
        employee,           // 담당자 정보 (로그인한 사용자 정보)

        // 상품 및 주문 상세 데이터 변경 함수
        handleProductChange,    // 상품 데이터 변경 처리 함수 (등록 시)
        handleProductEdit,      // 상품 수정 데이터 변경 처리 함수 (수정 시)
        addProductRow,          // 상품 행 추가 함수
        removeProductRow,       // 상품 행 제거 함수
        removeProducteditRow,   // 상품 수정 행 제거 함수

        // 주문 생성 및 수정 함수
        handleSubmit,   // 주문 생성 처리 함수
        handleEdit,     // 주문 수정 처리 함수
        handleResubmit, // 반려 시 주문 재생성 함수

        // 날짜 관련 함수
        formatDateForInput,  // 날짜를 yyyy-mm-dd 형식으로 변환하는 함수

        displayItems,
        editProductRow,
        displayItemEdit,
        setCustomerData,
        selectedProductIndex,
        setProducts,
        setOrderDetails,
        setSelectedProductIndex,
    };

};