import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useSearchParams } from "react-router-dom";
import Layout from "../../layout/Layout";
import '../../../resources/static/css/sales/OrderList.css';

const fetchOrders = async () => {
    try {
        const response = await fetch('/api/order/all');
        if (!response.ok) {
            throw new Error('네트워크 연결이 불안정합니다.');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        return [];
    }
};

const fetchEmployee = async () => {
    try {
        const response = await fetch('/api/employee', {
            credentials: "include", // 세션 포함
        });
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error('사용자 정보를 가져오는 데 실패했습니다.');
            return null;
        }
    } catch (error) {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error);
        return null;
    }
};

const updateOrderStatus = async (orderNo) => {
    try {
        const response = await fetch(`/api/order/updateStatus/${orderNo}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderHStatus: 'approved' }),
        });
        if (response.ok) {
            console.log("approved success");
            return true;
        } else {
            throw new Error('주문 상태 업데이트 실패');
        }
    } catch (error) {
        console.error('주문 상태를 업데이트하는 중 오류 발생');
        return false;
    }
};


const deniedOrderStatus = async (orderNo) => {
    try {
        const response = await fetch(`/api/order/updateStatus/${orderNo}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ orderHStatus: 'denied' }),
        });
        if (response.ok) {
            console.log("denied success");
            return true;
        } else {
            throw new Error('주문 상태 업데이트 실패');
        }
    } catch (error) {
        console.error('주문 상태를 업데이트하는 중 오류 발생');
        return false;

    }
};


function OrderList() {
    const [filterValue, setFilterValue] = useState('');
    const [filter, setFilter] = useState('');
    const [filterType, setFilterType] = useState('customer');
    const [searchTerm, setSearchTerm] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [currentPage, setCurrentPage] = useState(1);
    const [role, setRole] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState(''); // 상태
    const [pageInputValue, setPageInputValue] = useState('1'); // 페이지 입력값
    const [startDate, setStartDate] = useState(''); // 시작 날짜
    const [endDate, setEndDate] = useState(''); // 종료 날짜
    const [selectedOrders, setSelectedOrders] = useState(new Set()); // 체크된 주문 번호 집합
    const [allSelected, setAllSelected] = useState(false); // 전체 선택 체크박스 상태
    const [itsAssignedMode, setItsAssignedMode] = useState(false);

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const mode = searchParams.get('mode');
        if (mode === 'Assigned') {
            setItsAssignedMode(true);
        } else {
            setItsAssignedMode(false);
        }
    }, [searchParams])

    // useEffect(() => {
    //     if (itsAssignedMode) {
    //         setSelectedStatus('결재중');
    //         applyFilter('결재중');
    //     }
    // }, [itsAssignedMode]);



    const applyFilter = (filterValue) => {
        setFilter(filterValue);
        setFilterType("status");
        setSearchTerm('');
        setCurrentPage(1);
    };


    const handleStatusChange = (event) => {
        const status = event.target.value;
        setSelectedStatus(status);
        applyFilter(status);
    };

    const mapStatusFromDbToUi = (dbStatus) => {
        switch (dbStatus) {
            case 'ing':
                return '결재중';
            case 'approved':
                return '결재완료';
            case 'denied':
                return '반려';
            default:
                return '알 수 없음';
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 직원 정보 가져오기
                const empData = await fetchEmployee();
                if (empData) {
                    setRole(empData.employeeRole);
                    setEmployeeId(empData.employeeId);

                    // Assigned 모드에 대한 권한 검사
                    if (itsAssignedMode && empData.employeeRole !== 'admin') {
                        window.showToast('해당 페이지에 접근 권한이 없습니다.', 'error');
                        setTimeout(() => {
                            window.location.href = '/main'; // 권한 없는 사용자는 메인 페이지로 리디렉션
                        }, 1000); // 1000 밀리초
                        return;
                    }

                }
                // 주문 정보 가져오기
                const orderData = await fetchOrders();

                // 주문 필터링
                if (empData.employeeRole === 'admin') {
                    setOrders(orderData); // 관리자일 경우 모든 주문 표시
                } else {
                    const filteredOrders = orderData.filter(order => order.employee.employeeId === empData.employeeId);
                    setOrders(filteredOrders);
                }
            } catch (err) {
                window.showToast('해당 페이지에 접근 권한이 없습니다.', 'error');
                setTimeout(() => {
                    window.location.href = '/main';
                }, 1000); // 1000 밀리초
            } finally {
                setLoading(false); // 데이터 로딩 완료
            }
        };
        fetchData();
        // 현재 날짜를 기본값으로 설정
        const today = new Date();
        today.setHours(today.getHours() + 9); // UTC 시간에 9시간 더하기 (한국 시간)
        const formattedToday = today.toISOString().split('T')[0];
        setEndDate(formattedToday);
    }, [itsAssignedMode]);


    useEffect(() => {
        if (Array.isArray(filteredOrders)) {
            // 전체 선택 체크박스 상태 업데이트
            const ingOrders = filteredOrders.filter(order => order.orderHStatus === 'ing');
            const isAllSelected = ingOrders.length > 0 && ingOrders.every(order => selectedOrders.has(order.orderNo));
            setAllSelected(isAllSelected);
        } else {
            setAllSelected(false);
        }
    }, [selectedOrders, filteredOrders]);

    // 필터링된 주문을 등록일 기준으로 내림차순 정렬
    const sortedOrders = [...orders].sort((a, b) => {
        const dateA = new Date(a.orderHInsertDate);
        const dateB = new Date(b.orderHInsertDate);
        return dateB - dateA; // 내림차순 정렬
    });

    const filteredOrders = sortedOrders.filter(order => {
        const customerName = order.customer?.customerName || '';
        const orderDate = order.orderHInsertDate?.split('T')[0] || '';
        const orderStatus = mapStatusFromDbToUi(order.orderHStatus) || '';
        const productNames = (order.productNames || []).join(', ');
        const employeeName = order.employee?.employeeName || '';

        const matchesFilter = filterType === 'customer' ? customerName.includes(filter) :
            filterType === 'date' ? orderDate.includes(filter) :
                filterType === 'status' ? orderStatus.includes(filter) :
                    filterType === 'items' ? productNames.includes(filter) :
                        filterType === 'employee' ? employeeName.includes(filter) :
                            true;

        const matchesSearch = searchTerm ? [customerName, orderDate, orderStatus, productNames, employeeName].some(field => field.includes(searchTerm)) : true;

        const orderDateObj = new Date(order.orderHInsertDate.split('T')[0]);

        const isDateInRange = (!startDate || orderDateObj >= new Date(startDate)) &&
            (!endDate || orderDateObj <= new Date(endDate));

        return matchesFilter && matchesSearch && isDateInRange;
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    const formatProductNames = (productNames) => {
        if (!Array.isArray(productNames)) return 'N/A';
        if (productNames.length <= 1) {
            return productNames.join(', ');
        } else {
            return `${productNames[0]} 외 ${productNames.length - 1}건`;
        }
    };

    const handleItemsPerPageChange = (event) => {
        const value = Number(event.target.value);
        if (value > 0 && value <= 100) {
            setItemsPerPage(value);
            setCurrentPage(1); // 페이지 수 초기화
        }
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
        setPageInputValue(pageNumber.toString()); // 페이지 입력값 업데이트
    };

    const handlePageInputChange = (event) => {
        const value = event.target.value;
        if (/^\d*$/.test(value)) { // 숫자만 허용
            const pageNumber = Number(value);
            if (pageNumber >= 1 && pageNumber <= totalPages) {
                setPageInputValue(value);
                setCurrentPage(pageNumber);
            } else if (value === '') { // 입력값이 비어있는 경우
                setPageInputValue(value);
            }
        }
    };

    const handleCheckboxChange = (orderNo) => {
        setSelectedOrders(prev => {
            const newSelectedOrders = new Set(prev);
            if (newSelectedOrders.has(orderNo)) {
                newSelectedOrders.delete(orderNo);
            } else {
                newSelectedOrders.add(orderNo);
            }
            return newSelectedOrders;
        });
    };

    const handleSelectAll = (event) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            const newSelectedOrders = new Set(filteredOrders
                .filter(order => order.orderHStatus === 'ing')
                .map(order => order.orderNo));
            setSelectedOrders(newSelectedOrders);
        } else {
            setSelectedOrders(new Set());
        }
    };

    const handleDeniedSelectedOrders = async () => {

        window.confirmCustom("선택하신 주문을 반려하시겠습니까?").then(result => {
            if (result) {
                if (selectedOrders.size === 0) {
                    window.showToast('반려할 주문을 선택해 주세요.', 'error');
                    return;
                }

                let successCount = 0;
                let failCount = 0;

                const orderPromises = Array.from(selectedOrders).map(orderNo => {
                    return deniedOrderStatus(orderNo)
                        .then(result => {
                            if (result) {
                                successCount++;
                            } else {
                                failCount++;
                            }
                        })
                        .catch(error => {
                            console.error('반려 처리 중 오류 발생:', error);
                            failCount++;
                        });
                });

                Promise.all(orderPromises).then(() => {
                    if (successCount > 0) {
                        window.showToast(`${successCount}건의 주문이 정상적으로 반려되었습니다.`);
                    }
                    if (failCount > 0) {
                        window.showToast(`${failCount}건의 주문 반려에 실패했습니다.`, 'error');
                    }

                    // 반려 후 선택된 주문 목록 초기화
                    setSelectedOrders(new Set());

                    // 주문 목록 새로고침
                    fetchOrders().then(orderData => {
                        setOrders(role === 'admin' ? orderData : orderData.filter(order => order.employee.employeeId === employeeId));
                    });
                });

            }
        });

    };

    const handleApproveSelectedOrders = async () => {

        window.confirmCustom("선택하신 주문을 승인하시겠습니까?").then(result => {
            if (result) {
                if (selectedOrders.size === 0) {
                    window.showToast('승인할 주문을 선택해 주세요.', 'error');
                    return;
                }

                let successCount = 0;
                let failCount = 0;

                // 선택된 주문에 대해 비동기 요청 실행
                const orderPromises = Array.from(selectedOrders).map(orderNo => {
                    return updateOrderStatus(orderNo)
                        .then(result => {
                            if (result) {
                                successCount++;
                            } else {
                                failCount++;
                            }
                        })
                        .catch(error => {
                            console.error('승인 처리 중 오류 발생:', error);
                            failCount++;
                        });
                });

                // 모든 주문 승인 처리 후 결과 처리
                Promise.all(orderPromises).then(() => {
                    if (successCount > 0) {
                        window.showToast(`${successCount}건의 주문이 정상적으로 승인되었습니다.`);
                    }
                    if (failCount > 0) {
                        window.showToast(`${failCount}건의 주문 승인에 실패했습니다.`, 'error');
                    }

                    // 승인 후 선택된 주문 목록 초기화
                    setSelectedOrders(new Set());

                    // 주문 목록 새로고침
                    fetchOrders().then(orderData => {
                        setOrders(role === 'admin' ? orderData : orderData.filter(order => order.employee.employeeId === employeeId));
                    });
                });

            }
        });

    };

    const renderPageButtons = () => {
        const pageButtons = [];
        const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
        const endPage = Math.min(startPage + 4, totalPages);

        for (let page = startPage; page <= endPage; page++) {
            pageButtons.push(
                <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={currentPage === page ? 'box active' : 'box'}
                >
                    {page}
                </button>
            );
        }

        return pageButtons;
    };

    return (
        <Layout currentMenu='orderList'>
            <main className={`main-content menu_order_list ${role === 'admin' ? 'role_admin' : 'role_normal'}`}>
                <div className="menu_title">
                    <div className="sub_title">영업 관리</div>
                    <div className="main_title">
                        {!loading ? (role === 'admin' ? '전체 주문 목록' : '담당 주문 목록') : '주문 목록'}
                    </div>
                </div>
                <div className="menu_content">
                    <div className="search_wrap">
                        <div className="left">
                            <select className="box" onChange={(e) => setFilterType(e.target.value)}
                                value={filterType}>
                                <option value="customer">고객사</option>
                                <option value="date">주문 등록일</option>
                                <option value="status">주문 상태</option>
                                <option value="items">물품(계약) 리스트</option>
                                {role === 'admin' && (
                                    <option value="employee">담당자</option>
                                )}
                            </select>

                            <div className="search_box">
                                <i className="bi bi-search"></i>
                                <input
                                    type="text"
                                    className="box search"
                                    placeholder="검색어 입력"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <br />
                            <div className="radio_box">
                                <span>상태</span>
                                {/* 'itsAssignedMode'가 참일 때는 '결재중' 라디오 버튼만 보이도록 설정 */}


                                <input
                                    type="radio"
                                    id="all"
                                    name="status"
                                    value=""
                                    checked={selectedStatus === ''}
                                    onChange={handleStatusChange}
                                />
                                <label htmlFor="all">전체</label>

                                <input
                                    type="radio"
                                    id="pending"
                                    name="status"
                                    value="결재중"
                                    checked={selectedStatus === '결재중'}
                                    onChange={handleStatusChange}
                                />
                                <label htmlFor="pending">결재중</label>

                                <input
                                    type="radio"
                                    id="completed"
                                    name="status"
                                    value="결재완료"
                                    checked={selectedStatus === '결재완료'}
                                    onChange={handleStatusChange}
                                />
                                <label htmlFor="completed">결재완료</label>

                                <input
                                    type="radio"
                                    id="rejected"
                                    name="status"
                                    value="반려"
                                    checked={selectedStatus === '반려'}
                                    onChange={handleStatusChange}
                                />
                                <label htmlFor="rejected">반려</label>


                            </div>


                            <div className={`date_box ${startDate ? 'has_text' : ''}`}>
                                <label>주문 등록일</label>
                                <input
                                    type="date"
                                    max="9999-12-31"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <span className="date-separator">~</span>
                            <div className={`date_box ${endDate ? 'has_text' : ''}`} style={{ padding: '0' }}>
                                <input
                                    type="date"
                                    max="9999-12-31"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>

                        </div>

                        <div className="right">
                            {itsAssignedMode && role === 'admin' && (
                                <>
                                    <button className="box color" onClick={handleApproveSelectedOrders}>
                                        결재
                                    </button>
                                    <button className="box" onClick={handleDeniedSelectedOrders}>
                                        반려
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <div className="table_wrap">
                        <table>
                            <thead>
                                <tr>
                                    {itsAssignedMode && role === 'admin' && (
                                        <th className="checkbox-input">
                                            <label className="chkbox_label">
                                                <input
                                                    type="checkbox"
                                                    className="chkbox"
                                                    checked={allSelected}
                                                    onChange={handleSelectAll}
                                                />
                                                <i className="chkbox_icon">
                                                    <i className="bi bi-check-lg"></i>
                                                </i>
                                            </label>
                                        </th>
                                    )}
                                    <th>주문번호</th>
                                    <th>고객사</th>
                                    <th>주문 등록일</th>
                                    <th>주문 상태</th>
                                    <th>물품(계약) 리스트</th>
                                    <th>총액(원)</th>
                                    <th>담당자명</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 로딩 중일 때 로딩 애니메이션 표시 */}
                                {loading ? (
                                    <tr className="tr_empty">
                                        <td colSpan={role === 'admin' ? 10 : 9}> {/* admin 여부에 따라 colSpan 결정 */}
                                            <div className="loading">
                                                <span></span> {/* 첫 번째 원 */}
                                                <span></span> {/* 두 번째 원 */}
                                                <span></span> {/* 세 번째 원 */}
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (  // 데이터가 없을 경우 처리
                                    <tr className="tr_empty">
                                        <td colSpan={role === 'admin' ? 10 : 9}>
                                            <div className="no_data"><i className="bi bi-exclamation-triangle"></i>조회된 결과가 없습니다.</div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders
                                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                                        .map(order => (
                                            <tr key={order.orderNo}
                                                className={
                                                    selectedOrders.has(order.orderNo)
                                                        ? ('selected_row')  // 선택된 행
                                                        : ''
                                                }
                                            >
                                                {itsAssignedMode && role === 'admin' && (
                                                    <td className="checkbox-input">
                                                        {order.orderHStatus === 'ing' ? (
                                                            <label className="chkbox_label">
                                                                <input
                                                                    type="checkbox"
                                                                    className="chkbox"
                                                                    checked={selectedOrders.has(order.orderNo)}
                                                                    onChange={() => handleCheckboxChange(order.orderNo)}
                                                                    disabled={order.orderHStatus !== 'ing'} // ing가 아닐때는 비활성
                                                                />
                                                                <i className="chkbox_icon">
                                                                    <i className="bi bi-check-lg"></i>
                                                                </i>
                                                            </label>
                                                        ) : (
                                                            <label className="chkbox_label">
                                                                <input
                                                                    type="checkbox"
                                                                    className="chkbox"
                                                                    checked={selectedOrders.has(order.orderNo)}
                                                                    disabled
                                                                />
                                                                <i className="chkbox_icon">
                                                                    <i className="bi bi-check-lg"></i>
                                                                </i>
                                                            </label>
                                                        )}
                                                    </td>
                                                )}

                                                <td>{String(order.orderNo).padStart(3, '0')}</td>
                                                <td>{order.customer?.customerName || 'N/A'}</td>
                                                <td>{order.orderHInsertDate?.split('T')[0] || 'N/A'}</td>
                                                <td> <span
                                                    className={`order-status ${order.orderHStatus}`}>
                                                    {mapStatusFromDbToUi(order.orderHStatus)}
                                                </span>
                                                </td>
                                                <td>{formatProductNames(order.productNames || []) || 'N/A'}</td>
                                                <td>{order.orderHTotalPrice?.toLocaleString() + '원' || 'N/A'}</td>
                                                <td>{order.employee?.employeeName || 'N/A'}</td>
                                                <td>
                                                    <div className="btn_group">
                                                        <button
                                                            className="box small"
                                                            onClick={() => {
                                                                window.location.href = `/order?no=${order.orderNo}`;
                                                            }}
                                                        >
                                                            상세보기
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination-container">
                        <div className="pagination-sub left">
                            <input
                                type="number"
                                id="itemsPerPage"
                                className="box"
                                value={itemsPerPage}
                                onChange={handleItemsPerPageChange}
                                min={1}
                                max={100}
                                step={1}
                            />
                            <label htmlFor="itemsPerPage">건씩 보기 / <b>{filteredOrders.length}</b>건</label>
                        </div>
                        <div className="pagination">
                            {/* '처음' 버튼 */}
                            {currentPage > 1 && (
                                <button className="box icon first" onClick={() => handlePageClick(1)}>
                                    <i className="bi bi-chevron-double-left"></i>
                                </button>
                            )}


                            {/* '이전' 버튼 */}
                            {currentPage > 1 && (
                                <button className="box icon left" onClick={() => handlePageClick(currentPage - 1)}>
                                    <i className="bi bi-chevron-left"></i>
                                </button>
                            )}

                            {/* 페이지 번호 블록 계산 (1~5, 6~10 방식) */}
                            {renderPageButtons()}

                            {/* '다음' 버튼 */}
                            {currentPage < totalPages && (
                                <button className="box icon right" onClick={() => handlePageClick(currentPage + 1)}>
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            )}

                            {/* '끝' 버튼 */}
                            {currentPage < totalPages && (
                                <button className="box icon last" onClick={() => handlePageClick(totalPages)}>
                                    <i className="bi bi-chevron-double-right"></i>
                                </button>
                            )}
                        </div>

                        {/* 오른쪽: 페이지 번호 입력 */}
                        <div className="pagination-sub right">
                            <input
                                type="text"
                                id="pageInput"
                                className="box"
                                min={1}    // 최소값 설정
                                step={1}   // 1씩 증가/감소 가능
                                max={totalPages}
                                value={pageInputValue} // 상태로 관리되는 입력값
                                onChange={handlePageInputChange}
                            />
                            <label htmlFor="pageInput">/ <b>{totalPages}</b>페이지</label>
                        </div>
                    </div>

                </div>
            </main>
        </Layout>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <OrderList />
    </BrowserRouter>
);
