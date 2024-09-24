// src/main/react/components/price/PriceRow.js
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form'; // react-hook-form import
import { format } from 'date-fns';
import axios from 'axios'; // axios import

const PriceRow = ({
    isEditMode,
    priceData,
    selectedCustomer = { customerName: '', customerNo: '' }, // 기본값 설정
    selectedProduct = { productNm: '', productCd: '' },      // 기본값 설정
    onSave,
    onCancel,
    setCustomerModalOpen,
    setProductModalOpen,
    setSelectedCustomer, // 고객사 선택 후 값을 설정하는 함수
    setSelectedProduct,   // 상품 선택 후 값을 설정하는 함수
    currentPage,
    itemsPerPage,
    index,
    priceInsertDate,
    priceUpdateDate,
    openConfirmModal,
    setConfirmedAction,
    setModalMessage,
}) => {

    // 콤마 추가 함수
    const formatPriceWithComma = (value) => {
        if (!value) return '';
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    // 🔴 react-hook-form 설정
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitted },
        setValue,
        watch,
        trigger, // trigger 함수 추가
    } = useForm({
        defaultValues: priceData,
        mode: 'onChange', // 입력값 변경 시 유효성 검사 실행
    });

    // 🔴 필드 값 감시(watch : useState 없이도 폼 내에서 값의 변화를 실시간으로 감지)
    const priceCustomer = watch('priceCustomer'); // 가격 필드를 감시
    const selectedCustomerNo = watch('selectedCustomerNo'); // 고객 번호 필드를 감시
    const selectedProductCd = watch('selectedProductCd'); // 상품 코드 필드를 감시
    const priceStartDate = watch('priceStartDate'); // 시작 날짜 필드를 감시
    const priceEndDate = watch('priceEndDate'); // 종료 날짜 필드를 감시

    // 수정 모드일 때 선택된 고객사와 상품 정보를 유지
    useEffect(() => {
        if (isEditMode) {
            setSelectedCustomer({
                customerName: priceData.customerName,
                customerNo: priceData.customerNo,
            });
            setSelectedProduct({
                productNm: priceData.productNm,
                productCd: priceData.productCd,
            });
        }
    }, [isEditMode, priceData, setSelectedCustomer, setSelectedProduct]);

    // 🔴🔴🔴 update(기간이 겹치는 기존 데이터 적용일자 조정)
    const handleDuplicateCheck = async (duplicatePrices, inputStartDate, inputEndDate) => {
        // 기본적으로 입력한 값으로 초기화
        let updatedStartDate = inputStartDate;
        let updatedEndDate = inputEndDate;
        
        const duplicatePrice = duplicatePrices[0]; // 중복된 첫 번째 데이터 사용

        // 1️⃣ 특정 하루만 적용되는 데이터 처리 (시작일과 종료일이 동일한 경우)
        if (duplicatePrice.priceStartDate === duplicatePrice.priceEndDate) {
            window.showToast(`${duplicatePrice.priceStartDate} 에만 해당되는 데이터가 존재합니다. 데이터를 수정해주세요.`, 'error');
            return;
        }

        // 2️⃣ 입력 구간이 기존 구간 내에 완전히 포함되는 경우 처리 (예: 기존 1~5일, 입력 2~3일)
        if (inputStartDate >= duplicatePrice.priceStartDate && inputEndDate <= duplicatePrice.priceEndDate) {
            window.showToast(`입력한 기간을 포함하는 데이터가 존재합니다. 데이터를 수정해주세요.`, 'error');
            return;
        }

        // 3️⃣ 입력한 시작일이 기존 데이터와 겹치는 경우 - 기존 종료일의 다음 날로 설정
        if (inputStartDate <= duplicatePrice.priceEndDate && inputStartDate >= duplicatePrice.priceStartDate) {
            const nextDay = new Date(duplicatePrice.priceEndDate);
            nextDay.setDate(nextDay.getDate() + 1); // 종료일 다음 날로 설정
            updatedStartDate = nextDay.toISOString().split('T')[0]; // yyyy-mm-dd 형식으로 변환
        }

        // 4️⃣ 입력한 종료일이 기존 데이터와 겹치는 경우 - 기존 시작일의 전날로 설정
        if (inputEndDate >= duplicatePrice.priceStartDate && inputEndDate <= duplicatePrice.priceEndDate) {
            const prevDay = new Date(duplicatePrice.priceStartDate);
            prevDay.setDate(prevDay.getDate() - 1); // 시작일 전날로 설정
            updatedEndDate = prevDay.toISOString().split('T')[0]; // yyyy-mm-dd 형식으로 변환
        }

        // 겹치는 날짜에 따라 시작일 또는 종료일을 업데이트하는 모달 메시지 설정💡
        let updateMessage = `해당 고객사와 상품에 해당하는 데이터 중 <br>`;

        // 시작일이 겹치는 경우 - 기존 종료일 강조💡
        if (inputStartDate <= duplicatePrice.priceEndDate && inputStartDate >= duplicatePrice.priceStartDate) {
            updateMessage += `${duplicatePrice.priceStartDate} ~ <strong>${duplicatePrice.priceEndDate}</strong> 기간 동안 적용되는 데이터가 있습니다.<br>`;
            updateMessage += `해당 데이터의 <strong>시작일</strong>을 <strong>${updatedStartDate}</strong>으로 조정하시겠습니까?`;
        }
        // 종료일이 겹치는 경우 - 기존 시작일 강조💡
        else if (inputEndDate >= duplicatePrice.priceStartDate && inputEndDate <= duplicatePrice.priceEndDate) {
            updateMessage += `<strong>${duplicatePrice.priceStartDate}</strong> ~ ${duplicatePrice.priceEndDate} 기간 동안 적용되는 데이터가 있습니다.<br>`;
            updateMessage += `해당 데이터의 <strong>종료일</strong>을 <strong>${updatedEndDate}</strong>으로 조정하시겠습니까?`;
        }

        // 모달 메시지 설정
        setModalMessage(updateMessage);

        // 모달 열기
        openConfirmModal();

        // 확인 버튼을 누르면 기존 데이터 업데이트 실행
        setConfirmedAction(() => async () => {
            // 요청 데이터 로그 출력
            const requestData = {
                priceNo: duplicatePrice.priceNo,
                priceStartDate: updatedStartDate,  // 새로운 시작일로
                priceEndDate: updatedEndDate  // 새로운 종료일로
            };
            console.log('🔴 Request Data to be sent:', requestData);

            try {
                const response = await axios.put('/api/price/update', requestData);
                console.log("업데이트 성공:", response.data);
                window.showToast('업데이트 성공');
                fetchData();  // 성공 시 데이터 다시 불러오기
            } catch (error) {
                console.error("업데이트 실패:", error);
                window.showToast('업데이트 실패', 'error');
            }
        });
    };


    // 🔴🔴🔴 insert/update(작성/수정 완료 버튼 클릭 시 실행)
    const onSubmit = async (data) => {
        // data.priceCustomer가 문자열인지 확인한 후, 콤마 제거한 실제 값을 저장
        if (typeof data.priceCustomer === 'string') {
            data.priceCustomer = data.priceCustomer.replace(/,/g, '');
        } else {
            // 만약 숫자나 다른 타입일 경우 문자열로 변환한 후 처리
            data.priceCustomer = String(data.priceCustomer).replace(/,/g, '');
        }

        // 🔴 중복 데이터 확인 API 호출
        try {
            const requestData = {
                customerNo: selectedCustomer.customerNo,
                productCd: selectedProduct.productCd,
                priceStartDate: data.priceStartDate,
                priceEndDate: data.priceEndDate
            };

            const duplicateCheckResponse = await axios.post('/api/price/check-duplicate', requestData);

            const duplicatePrices = duplicateCheckResponse.data; // 중복된 PriceDTO 리스트를 받음

            // 수정/등록 모드에 따른 중복 처리 로직
            if ((isEditMode && duplicatePrices.length > 1) || (!isEditMode && duplicatePrices.length > 0)) {
                handleDuplicateCheck(duplicatePrices, data.priceStartDate, data.priceEndDate);
                return;
            }

        } catch (error) {
            console.error('Duplicate check failed:', error);
            return; // 중복 확인 실패 시 저장 중단
        }

        // 🔴 등록 및 수정 API 호출
        try {

            const requestData = [
                {
                    customerNo: selectedCustomer.customerNo,
                    productCd: selectedProduct.productCd,
                    priceCustomer: parseInt(data.priceCustomer, 10),
                    priceStartDate: data.priceStartDate,
                    priceEndDate: data.priceEndDate
                }
            ];

            // 요청 데이터 로그 출력
            console.log('🔴 Request Data to be sent:', requestData);

            // 수정 모드일 경우 priceNo 추가
            if (isEditMode) {
                requestData[0].priceNo = priceData.priceNo; // 배열의 첫 번째 요소에 priceNo 추가
            }

            let response;
            if (isEditMode) {
                console.log('🔴 update');
                // 수정 모드일 경우 PUT 메서드로 요청
                response = await axios.put(`/api/price/update`, requestData);
            } else {
                console.log('🔴 insert');
                // 새로 추가할 경우 POST 메서드로 요청
                response = await axios.post(`/api/price/insert`, requestData);
            }

            // 응답 데이터 확인
            console.log('🔴 Response Data:', response.data);

            // 저장 성공 시 onSave 호출
            onSave(data); // handleAddSave()

            // 저장 후 고객사, 상품, 가격 정보 초기화
            setSelectedCustomer({ customerName: '고객사 선택', customerNo: '' });
            setSelectedProduct({ productNm: '상품 선택', productCd: '' });
            setValue('priceCustomer', ''); // 가격 필드 초기화
            setValue('priceStartDate', ''); // 시작일 필드 초기화
            setValue('priceEndDate', ''); // 종료일 필드 초기화
        } catch (error) {
            console.error('Insert/Update failed:', error);
        }
    };

    // 🟡 고객사 선택 시 처리
    useEffect(() => {
        setValue('selectedCustomerNo', selectedCustomer.customerNo, { shouldValidate: isSubmitted });
    }, [selectedCustomer, setValue, isSubmitted]);

    // 🟡 상품 선택 시 처리
    useEffect(() => {
        setValue('selectedProductCd', selectedProduct.productCd, { shouldValidate: isSubmitted });
    }, [selectedProduct, setValue, isSubmitted]);

    // 🟡 날짜 입력 시 유효성 검사 실행
    useEffect(() => {
        if (isSubmitted) {
            trigger('priceStartDate');
            trigger('priceEndDate');
        }
    }, [priceStartDate, priceEndDate, trigger, isSubmitted]);

    // 🟡 기본 값에 콤마 적용
    useEffect(() => {
        if (isEditMode && priceData.priceCustomer) {
            const formattedPrice = formatPriceWithComma(priceData.priceCustomer);
            setValue('priceCustomer', formattedPrice);
        }
    }, [isEditMode, priceData.priceCustomer, setValue]);

    // 🟢 가격 입력 시 처리
    const handlePriceChange = (e) => {
        let value = e.target.value;

        // 문자열로 변환한 후 처리
        if (typeof value !== 'string') {
            value = String(value);
        }

        value = value.replace(/,/g, ''); // 콤마 제거
        if (!isNaN(value) && parseInt(value, 10) >= 0) {
            value = parseInt(value, 10).toLocaleString(); // 세 자리마다 콤마 추가
        }

        setValue('priceCustomer', value, { shouldValidate: isSubmitted }); // 값 업데이트 및 유효성 검사 실행
    };

    // 🟢 취소 버튼 클릭 시 고객사와 상품 선택 상태 초기화
    const handleCancel = () => {
        setSelectedCustomer({ customerName: '고객사 선택', customerNo: '' }); // 고객사 선택 정보 초기화
        setSelectedProduct({ productNm: '상품 선택', productCd: '' });      // 상품 선택 정보 초기화
        onCancel(); // 취소 처리
    };

    // 🟢 일반 필드에 대한 클래스 적용 로직 
    const getFieldClass = (fieldError, fieldValue, isEditMode) => {
        if (fieldError) return 'field_error'; // 에러가 있을 때
        if (isEditMode && !fieldError) return 'field_ok'; // 수정 모드일 때는 에러가 없으면 'ok' 클래스 추가
        if (fieldValue !== null && fieldValue !== undefined && fieldValue !== '') return 'field_ok'; // 값이 입력되면 'ok' 추가
        return ''; // 아무 값도 없을 때
    };

    // 등록 또는 수정 tr
    return (
        <tr className='tr_input'>
            {/* 체크박스 칸 */}
            <td>
                {isEditMode ? (
                    <label className="chkbox_label">
                        {priceData.priceDeleteYn !== 'Y' && (
                            <>
                                <input
                                    type="checkbox"
                                    className="chkbox"
                                    disabled={true}
                                />
                                <i className="chkbox_icon">
                                    <i className="bi bi-check-lg"></i>
                                </i>
                            </>
                        )}
                    </label>
                ) : (
                    '-'
                )}
            </td>
            {/* 번호 */}
            <td>
                {isEditMode ? (currentPage - 1) * itemsPerPage + index + 1 : '-'}
            </td>
            <td className="vat">
                {/* 고객사 검색 버튼 */}
                <button
                    className={`box btn_search wp100 ${getFieldClass(errors.selectedCustomerNo, selectedCustomer.customerNo)}`}
                    onClick={() => setCustomerModalOpen(true)}
                >
                    {selectedCustomer.customerName || '고객사 선택'} {/* 선택된 고객사 이름 표시 */}
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
                    className={`box btn_search wp100 ${getFieldClass(errors.selectedProductCd, selectedProduct.productCd)}`}
                    onClick={() => setProductModalOpen(true)}
                >
                    {selectedProduct.productNm || '상품 선택'}  {/* 선택된 상품 이름 표시 */}
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
                        className={`box price ${getFieldClass(errors.priceCustomer, priceCustomer)}`}
                        placeholder="0"
                        {...register('priceCustomer', {
                            required: '가격을 입력해주세요',
                            validate: (value) => {
                                // value가 문자열이 아닌 경우 문자열로 변환
                                const stringValue = typeof value === 'string' ? value : String(value);
                                return parseInt(stringValue.replace(/,/g, ''), 10) > 0 || '가격은 0보다 커야 합니다';
                            }
                        })}
                        onInput={(e) => {
                            let value = e.target.value.replace(/[^0-9]/g, ''); // 숫자가 아닌 문자는 제거
                            e.target.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 세 자리마다 콤마 추가
                        }}
                        onChange={handlePriceChange}
                    />
                    <span>원</span>
                </div>
                {errors.priceCustomer && (
                    <p className="field_error_msg"><i className="bi bi-exclamation-circle-fill"></i>{errors.priceCustomer.message}</p>
                )}
            </td>
            <td className="vat">
                <input
                    type="date"
                    max="9999-12-31"
                    className={`box ${getFieldClass(errors.priceStartDate, priceStartDate, isEditMode)}`}
                    placeholder="시작일"
                    {...register('priceStartDate', {
                        required: '시작일을 입력해주세요',
                        validate: (value) => {
                            if (priceEndDate && new Date(value) > new Date(priceEndDate)) {
                                return '종료일보다 늦습니다.';
                            }
                            return true;
                        },
                    })}
                />
                {errors.priceStartDate && (
                    <p className="field_error_msg">
                        <i className="bi bi-exclamation-circle-fill"></i>{errors.priceStartDate.message}
                    </p>
                )}
            </td>
            <td className="vat">
                <input
                    type="date"
                    max="9999-12-31"
                    className={`box ${getFieldClass(errors.priceEndDate, priceEndDate, isEditMode)}`}
                    placeholder="종료일"
                    {...register('priceEndDate', {
                        required: '종료일을 입력해주세요',
                        validate: (value) => {
                            if (priceStartDate && new Date(value) < new Date(priceStartDate)) {
                                return '시작일보다 빠릅니다.';
                            }
                            return true;
                        },
                    })}
                />
                {errors.priceEndDate && (
                    <p className="field_error_msg">
                        <i className="bi bi-exclamation-circle-fill"></i>{errors.priceEndDate.message}
                    </p>
                )}
            </td>
            <td>
                {isEditMode ? (priceInsertDate ? format(new Date(priceInsertDate), 'yy-MM-dd HH:mm') : '-') : '-'}
            </td>
            <td>
                {isEditMode ? (priceUpdateDate ? format(new Date(priceUpdateDate), 'yy-MM-dd HH:mm') : '-') : '-'}
            </td>
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
