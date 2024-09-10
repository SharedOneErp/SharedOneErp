import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client'; // ReactDOM을 사용하여 React 컴포넌트를 DOM에 렌더링
import {BrowserRouter, Routes, Route, useSearchParams} from "react-router-dom"; // 리액트 라우팅 관련 라이브러리
import Layout from "../../layout/Layout"; // 공통 레이아웃 컴포넌트를 임포트 (헤더, 푸터 등)
import '../../../resources/static/css/product/ProductPrice.css'; // 개별 CSS 스타일 적용
import {formatDate} from '../../util/dateUtils'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

// 상품 검색 모달 컴포넌트
const Modal = ({isOpen, onClose, onSelect}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    // 상품 검색 함수 (검색어에 따라 결과 필터링)
    const handleSearch = async (e) => {
        e.preventDefault();
        // 검색 API 호출 (예시: `/api/products?search=${searchTerm}`)
        //const response = await axios.get(`/api/products?search=${searchTerm}`);
        setResults(response.data);
    };


    const handleSelect = (item) => {
        onSelect(item);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>상품 검색</h2>
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="상품 이름을 입력하세요"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit">검색</button>
                </form>
                <ul>
                    {results.map((item) => (
                        <li key={item.id} onClick={() => handleSelect(item)}>
                            {item.name}
                        </li>
                    ))}
                </ul>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

function ProductPrice() {
    const [priceList, setPriceList] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    // 기본 데이터 로드 (axios로 서버에서 받아옴)
    useEffect(() => {
        // 검색어와 페이지 번호를 쿼리 파라미터로 전달🟥🟥🟥🟥🟥🟥
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/price/all', {
                    params: {
                        customer: selectedCustomer ? selectedCustomer : null,
                        product: selectedProduct ? selectedProduct : null,
                        startDate: null, //startDate ? formatDate(startDate) : null,
                        endDate: null, //endDate ? formatDate(endDate) : null,
                        page: currentPage,
                        size: itemsPerPage, // 한 페이지에 보여줄 항목 수
                        sort: sortField ? `${sortField},${sortOrder}` : null, // 정렬 필드와 순서
                    },
                });

                console.log(response.data); // 서버에서 받은 데이터 콘솔 출력
                setPriceList(response.data); // 서버에서 받은 데이터를 상태로 저장
            } catch (error) {
                console.error('데이터를 불러오는 중 오류 발생:', error);
            }
        };

        fetchData();
    }, [selectedCustomer, selectedProduct, startDate, endDate, currentPage, itemsPerPage, sortField, sortOrder]);

    // 가격 항목 추가
    const handleAddPrice = () => {
        setPriceList([
            ...priceList,
            {
                customer: '',
                product: '',
                price: '',
                startDate: new Date(),
                endDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    };

    // 폼 데이터 변경 시 호출
    const handleChange = (index, field, value) => {
        const newList = [...priceList];
        newList[index][field] = value;
        newList[index].updatedAt = new Date();
        setPriceList(newList);
    };

    // 항목 삭제
    const handleDelete = (index) => {
        const newList = priceList.filter((_, i) => i !== index);
        setPriceList(newList);
    };

    // 수정 모드로 변경
    const handleEdit = (index) => {
        setEditIndex(index);
    };

    // 수정 완료 후 저장
    const handleSave = () => {
        setEditIndex(null);
    };

    // 모달 열기
    const openModal = () => {
        setIsModalOpen(true);
    };

    // 모달 닫기
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product.name);
    };

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    // 검색 필터링된 리스트 반환
    const filteredList = priceList.filter((item) => {
        const matchesCustomer = !selectedCustomer || item.customer.includes(selectedCustomer);
        const matchesProduct = !selectedProduct || item.product.includes(selectedProduct);
        const matchesDate =
            (!startDate || item.startDate >= startDate) &&
            (!endDate || item.endDate <= endDate);

        return matchesCustomer && matchesProduct && matchesDate;
    });

    const sortedList = [...filteredList].sort((a, b) => {
        if (!sortField) return 0;
        const order = sortOrder === 'asc' ? 1 : -1;
        if (a[sortField] < b[sortField]) return -order;
        if (a[sortField] > b[sortField]) return order;
        return 0;
    });

    const paginatedList = sortedList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    return (<Layout currentMenu="productList">
            <div className="top-container">
                <h2>고객사별 상품 가격 관리</h2>
                {/* 검색 영역 */}
                <div className="search-section">
                    <div>
                        <label>고객사 선택: </label>
                        <input
                            type="text"
                            placeholder="고객사 입력"
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>상품 선택: </label>
                        <button type="button" onClick={openModal}>
                            {selectedProduct || '상품 검색'}
                        </button>
                    </div>

                    <div>
                        <label>시작 날짜: </label>
                        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)}/>
                    </div>

                    <div>
                        <label>종료 날짜: </label>
                        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)}/>
                    </div>

                    <button onClick={() => setCurrentPage(1)}>검색</button>
                </div>

                <form>
                    {/* 테이블 헤더 */}
                    <div className="table-header">
                        <div onClick={() => handleSort('customer')}>고객사</div>
                        <div onClick={() => handleSort('product')}>상품</div>
                        <div>가격</div>
                        <div onClick={() => handleSort('startDate')}>시작 날짜</div>
                        <div onClick={() => handleSort('endDate')}>종료 날짜</div>
                        <div>등록일시</div>
                        <div>수정일시</div>
                    </div>

                    {/* 테이블 내용 */}
                    {paginatedList.map((priceItem, index) => (
                        <div key={index} className="price-row">
                            <div>
                                {editIndex === index ? (
                                    <input
                                        type="text"
                                        value={priceItem.customer}
                                        onChange={(e) => handleChange(index, 'customer', e.target.value)}
                                    />
                                ) : (
                                    priceItem.customer
                                )}
                            </div>
                            <div>
                                {editIndex === index ? (
                                    <input
                                        type="text"
                                        value={priceItem.product}
                                        onChange={(e) => handleChange(index, 'product', e.target.value)}
                                    />
                                ) : (
                                    priceItem.product
                                )}
                            </div>
                            <div>
                                {editIndex === index ? (
                                    <input
                                        type="number"
                                        value={priceItem.price}
                                        onChange={(e) => handleChange(index, 'price', e.target.value)}
                                    />
                                ) : (
                                    priceItem.price
                                )}
                            </div>
                            <div>
                                {editIndex === index ? (
                                    <DatePicker
                                        selected={new Date(priceItem.startDate)}
                                        onChange={(date) => handleChange(index, 'startDate', date)}
                                    />
                                ) : (
                                    new Date(priceItem.startDate).toLocaleDateString()
                                )}
                            </div>
                            <div>
                                {editIndex === index ? (
                                    <DatePicker
                                        selected={new Date(priceItem.endDate)}
                                        onChange={(date) => handleChange(index, 'endDate', date)}
                                    />
                                ) : (
                                    new Date(priceItem.endDate).toLocaleDateString()
                                )}
                            </div>
                            <div>{new Date(priceItem.createdAt).toLocaleString()}</div>
                            <div>{new Date(priceItem.updatedAt).toLocaleString()}</div>
                            <div>
                                {editIndex === index ? (
                                    <button type="button" onClick={handleSave}>
                                        저장
                                    </button>
                                ) : (
                                    <button type="button" onClick={() => handleEdit(index)}>
                                        수정
                                    </button>
                                )}
                                <button type="button" onClick={() => handleDelete(index)}>
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={handleAddPrice}>
                        추가
                    </button>
                </form>

                <div>
                    <label>보기: </label>
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>

                {/* 페이지네이션 */}
                <div>
                    {Array.from({length: totalPages}, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            disabled={currentPage === i + 1} // 현재 페이지 비활성화
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                {/* 상품 검색 모달 */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    onSelect={handleProductSelect}
                />
            </div>

        </Layout>

    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
        <ProductPrice/>
    </BrowserRouter>
);
