import React from 'react';
import { useForm } from 'react-hook-form'; // react-hook-form import
import axios from 'axios'; // axios import

const PriceRow = ({
    isEditMode,
    priceData,
    selectedCustomer = { customerName: '', customerNo: '' }, // 기본값 설정
    selectedProduct = { productNm: '', productCd: '' },      // 기본값 설정
    handleInputChange,
    onSave,
    onCancel,
    setCustomerModalOpen,
    setProductModalOpen,
    setSelectedCustomer, // 고객사 선택 후 값을 설정하는 함수
    setSelectedProduct   // 상품 선택 후 값을 설정하는 함수
}) => {
    // react-hook-form 설정
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        getValues,
        clearErrors // 오류 메시지를 지우는 함수
    } = useForm({
        defaultValues: priceData // 기본 값 설정
    });

    // 가격 입력 시 포맷팅 처리 (세 자리마다 콤마 추가) 및 0 이상의 값만 입력 가능
    const handlePriceChange = (e) => {
        let value = e.target.value.replace(/,/g, ''); // 콤마 제거
        if (!isNaN(value) && parseInt(value, 10) >= 0) {
            value = parseInt(value, 10).toLocaleString(); // 세 자리마다 콤마 추가
        }
        setValue('priceCustomer', value); // react-hook-form을 통해 값 업데이트
        clearErrors('priceCustomer'); // 입력값이 변경되면 오류 메시지 제거
    };

    // 고객사 선택 시
    const handleCustomerSelect = (customer) => {
        setSelectedCustomer(customer);
        setValue('selectedCustomerNo', customer.customerNo); // 고객 번호를 react-hook-form의 필드에 설정
        if (customer.customerNo) { // 고객 번호가 존재할 때만 오류 제거
            clearErrors('selectedCustomerNo');
        }
        setCustomerModalOpen(false); // 모달 닫기
    };

    // 상품 선택 시
    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setValue('selectedProductCd', product.productCd); // 상품 코드를 react-hook-form의 필드에 설정
        if (product.productCd) { // 상품 코드가 존재할 때만 오류 제거
            clearErrors('selectedProductCd');
        }
        setProductModalOpen(false); // 모달 닫기
    };

    // 저장 버튼 클릭 시 실행되는 함수
    const onSubmit = async (data) => {
        data.priceCustomer = data.priceCustomer.replace(/,/g, ''); // 콤마 제거한 실제 값을 저장

        const requestData = [
            {
                customerNo: selectedCustomer.customerNo,
                productCd: selectedProduct.productCd,
                priceCustomer: parseInt(data.priceCustomer, 10),
                priceStartDate: data.priceStartDate,
                priceEndDate: data.priceEndDate
            }
        ];

        try {
            // 요청 데이터 로그 출력
            console.log('🔴 Request Data:', requestData);

            // axios로 POST 요청 보내기
            const response = await axios.post('/api/price/insert', requestData);

            // 응답 데이터 확인
            console.log('🔴 Inserted Price Data:', response.data);

            // 저장 성공 시 onSave 호출
            onSave(data);
        } catch (error) {
            console.error('Insert failed:', error);
        }
    };

    // 적용기간 유효성 검사 (시작일과 종료일이 모두 입력되어야 함)
    const validatePeriod = () => {
        const { priceStartDate, priceEndDate } = getValues();
        if (!priceStartDate || !priceEndDate) {
            return '시작일과 종료일을 모두 입력해주세요'; // 에러 메시지 한 줄로 출력
        }
        return true;
    };

    // 취소 버튼 클릭 시 고객사와 상품 선택 상태 초기화
    const handleCancel = () => {
        setSelectedCustomer({ customerName: '고객사 선택', customerNo: '' }); // 고객사 선택 정보 초기화
        setSelectedProduct({ productNm: '상품 선택', productCd: '' });      // 상품 선택 정보 초기화
        onCancel(); // 취소 처리
    };

    return (
        <tr className='tr_input'>
            <td>-</td> {/* 체크박스 칸 */}
            <td>-</td> {/* 번호 */}
            <td className="vat">
                {/* 고객사 검색 버튼 */}
                <button
                    className={`box btn_search wp100 ${errors.selectedCustomerNo ? 'field_error' : ''}`}
                    onClick={() => setCustomerModalOpen(true)} // 모달을 열기만 함
                >
                    {selectedCustomer.customerName}  {/* 선택된 고객사 이름 표시 */}
                    <i className="bi bi-search"></i>
                </button>
                {/* hidden input 필드에 고객 번호 저장 */}
                <input
                    type="hidden"
                    {...register('selectedCustomerNo', { required: '고객사를 선택해주세요' })}
                    value={selectedCustomer.customerNo}
                />
                {errors.selectedCustomerNo && (
                    <p className="field_error_msg"><i className="bi bi-exclamation-circle-fill"></i>{errors.selectedCustomerNo.message}</p>
                )}
            </td>
            <td className="vat">
                {/* 상품 검색 버튼 */}
                <button
                    className={`box btn_search wp100 ${errors.selectedProductCd ? 'field_error' : ''}`}
                    onClick={() => setProductModalOpen(true)} // 모달을 열기만 함
                >
                    {selectedProduct.productNm}  {/* 선택된 상품 이름 표시 */}
                    <i className="bi bi-search"></i>
                </button>
                {/* hidden input 필드에 상품 코드 저장 */}
                <input
                    type="hidden"
                    {...register('selectedProductCd', { required: '상품을 선택해주세요' })}
                    value={selectedProduct.productCd}
                />
                {errors.selectedProductCd && (
                    <p className="field_error_msg"><i className="bi bi-exclamation-circle-fill"></i>{errors.selectedProductCd.message}</p>
                )}
            </td>
            <td className="vat">
                <div className="input-with-text">
                    <input
                        type="text"
                        className={`box price ${errors.priceCustomer ? 'field_error' : ''}`}
                        placeholder="0"
                        {...register('priceCustomer', {
                            required: '가격을 입력해주세요',
                            validate: value => parseInt(value.replace(/,/g, ''), 10) > 0 || '가격은 0보다 커야 합니다'
                        })}
                        onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')} // 숫자만 입력 가능
                        onChange={handlePriceChange} // 값 변경 시 포맷팅 처리 및 오류 제거
                    />
                    <span>원</span>
                </div>
                {errors.priceCustomer && (
                    <p className="field_error_msg"><i className="bi bi-exclamation-circle-fill"></i>{errors.priceCustomer.message}</p>
                )}
            </td>
            <td className="vat">
                <div className='period_box'>
                    {/* 시작일 클릭 시 달력 열기 */}
                    <input
                        id="priceStartDate"
                        type="date"
                        max="9999-12-31"
                        className={`date box ${errors.priceStartDate ? 'field_error' : ''}`}
                        placeholder="시작일"
                        {...register('priceStartDate', { validate: validatePeriod })}
                        onClick={(e) => e.target.showPicker()} // 무조건 달력 열기
                        onChange={() => clearErrors(['priceStartDate', 'priceEndDate'])}
                    />
                    ~
                    {/* 종료일 클릭 시 달력 열기 */}
                    <input
                        id="priceEndDate"
                        type="date"
                        max="9999-12-31"
                        className={`date box ${errors.priceEndDate ? 'field_error' : ''}`}
                        placeholder="종료일"
                        {...register('priceEndDate', { validate: validatePeriod })}
                        onClick={(e) => e.target.showPicker()} // 무조건 달력 열기
                        onChange={() => clearErrors(['priceStartDate', 'priceEndDate'])}
                    />
                </div>
                {errors.priceStartDate || errors.priceEndDate ? (
                    <p className="field_error_msg"><i className="bi bi-exclamation-circle-fill"></i>시작일과 종료일을 모두 입력해주세요</p>
                ) : null}
            </td>
            <td>-</td> {/* 등록일시 */}
            <td>-</td> {/* 수정일시 */}
            <td>-</td> {/* 삭제일시 */}
            <td>
                <div className='btn_group'>
                    <button
                        className="box color_border"
                        onClick={handleSubmit(onSubmit)} // react-hook-form의 handleSubmit 사용
                    >
                        {`${isEditMode ? '수정 완료' : '작성 완료'}`}
                    </button>
                    <button className="box" onClick={handleCancel}>취소</button>
                </div>
            </td>
        </tr>
    );
};

export default PriceRow;
