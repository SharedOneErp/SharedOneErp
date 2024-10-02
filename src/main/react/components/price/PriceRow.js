// src/main/react/components/price/PriceRow.js
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'; // react-hook-form import
import { format } from 'date-fns';
import axios from 'axios'; // axios import

const PriceRow = ({
    isEditMode,
    priceData,
    selectedCustomer = { customerName: '', customerNo: '' }, // 기본값 설정
    selectedProduct = { productNm: '', productCd: '', productPrice: 0 },      // 기본값 설정
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

    // 🔴 상품 가격 상태 추가
    const [productPrice, setProductPrice] = useState(selectedProduct.productPrice);

    // 🔴🔴🔴 update(기간이 겹치는 기존 데이터 적용일자 조정)
    const handleDuplicateCheck = async (duplicatePrices, inputStartDate, inputEndDate, data) => {

        // 🟢 중복 데이터에서 조건에 따라 사용할 데이터를 결정
        let duplicatePrice;
        // 수정 모드에서 현재 수정 중인 데이터를 제외하고 중복 데이터를 선택
        if (isEditMode && duplicatePrices.length > 1) {
            duplicatePrice = duplicatePrices.find(price => price.priceNo !== priceData.priceNo);
        } else {
            duplicatePrice = duplicatePrices[0];
        }

        // 🟢 사용할 데이터 정리
        const existingStart = duplicatePrice.priceStartDate;
        const existingEnd = duplicatePrice.priceEndDate;
        const inputStart = inputStartDate;
        const inputEnd = inputEndDate;
        let updatedStartDate = existingStart;
        let updatedEndDate = existingEnd;
        console.log("inputStart : " + inputStart);
        console.log("inputStart < inputEnd : " + (inputStart < inputEnd));
        console.log("inputStart > inputEnd : " + (inputStart > inputEnd));

        // 🟢 기존 데이터 수정 불가, 입력 데이터를 수정해야 함
        // 1️⃣ 기존 데이터가 특정 하루만 적용되는 경우
        if (existingStart === existingEnd) {
            console.log("case 1");
            window.showToast(`${existingStart} 에만 해당되는 데이터가 존재합니다.`, 'error');
            return;
        }

        // 2️⃣ 입력한 기간이 기존 데이터를 완전히 포함하는 경우 (예: 기존 2~3일, 입력 1~5일)
        if (inputStart <= existingStart && inputEnd >= existingEnd) {
            console.log("case 2");
            window.showToast(`${existingStart}~${existingEnd} 에 해당되는 데이터가 존재합니다.`, 'error');
            return;
        }

        // 🟢 기존 데이터를 수정, 입력 데이터와 겹치지 않게 시작일 또는 종료일을 조정
        // 겹치는 날짜에 따라 기존 데이터의 시작일 또는 종료일을 수정하는 모달 메시지 설정
        let updateMessage = `해당 고객사와 상품에 해당하는 데이터 중 <br>`;
        // 3️⃣ 기존 종료일보다 입력 종료일이 큰 경우 -> 기존 데이터의 종료일을 입력 데이터의 시작일 전날로 조정💡1
        if (inputEnd > existingEnd) {
            console.log("case 3");
            const prevDay = new Date(inputStart);
            prevDay.setDate(prevDay.getDate() - 1);
            updatedEndDate = prevDay.toISOString().split('T')[0]; // yyyy-mm-dd 형식으로 변환
            updateMessage += `${existingStart} ~ <strong>${existingEnd}</strong> 기간 동안 적용되는 데이터가 있습니다.<br>`;
            updateMessage += `해당 데이터의 <strong>종료일</strong>을 <strong>${updatedEndDate}</strong>으로 수정하시겠습니까?`;
        }
        // 4️⃣ 기존 종료일보다 입력 종료일이 작은 경우
        else {
            if (inputStart > existingStart) { // 기존 데이터의 종료일을 입력 데이터의 시작일 전날로 조정(기존 데이터가 입력 데이터를 포함)💡1
                console.log("case 4-1");
                const prevDay = new Date(inputStart);
                prevDay.setDate(prevDay.getDate() - 1);
                updatedEndDate = prevDay.toISOString().split('T')[0]; // yyyy-mm-dd 형식으로 변환
                updateMessage += `${existingStart} ~ <strong>${existingEnd}</strong> 기간 동안 적용되는 데이터가 있습니다.<br>`;
                updateMessage += `해당 데이터의 <strong>종료일</strong>을 <strong>${updatedEndDate}</strong>으로 수정하시겠습니까?`;
            } else { // 기존 데이터의 시작일을 입력 데이터의 종료일 다음날로 조정💡2
                console.log("case 4-2");
                const nextDay = new Date(inputEnd);
                nextDay.setDate(nextDay.getDate() + 1);
                updatedStartDate = nextDay.toISOString().split('T')[0]; // yyyy-mm-dd 형식으로 변환
                updateMessage += `<strong>${existingStart}</strong> ~ ${existingEnd} 기간 동안 적용되는 데이터가 있습니다.<br>`;
                updateMessage += `해당 데이터의 <strong>시작일</strong>을 <strong>${updatedStartDate}</strong>으로 수정하시겠습니까?`;
            }
        }

        // 🟢 confirm 창
        window.confirmCustom(updateMessage, "500px").then(result => {
            if (result) {
                const requestData = [{
                    priceNo: duplicatePrice.priceNo,  // 기존 데이터의 priceNo 사용
                    customerNo: duplicatePrice.customerNo, //
                    productCd: duplicatePrice.productCd, //
                    priceCustomer: duplicatePrice.priceCustomer,  // 가격
                    priceStartDate: updatedStartDate,  // 수정된 시작일
                    priceEndDate: updatedEndDate  // 수정된 종료일
                }];

                console.log('🟢 기존 데이터 수정 Request Data to be sent:', requestData);

                // axios 요청을 then() 체인으로 처리
                axios.put('/api/price/update', requestData)
                    .then(response => {
                        console.log("업데이트 성공:", response.data);

                        // 등록/수정 API 호출
                        return submitPriceData(data);
                    })
                    .then(() => {
                        console.log('Price data submitted successfully.');
                    })
                    .catch(error => {
                        console.error("업데이트 실패 또는 등록 실패:", error);
                    });
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

            // 중복 확인 및 처리 로직
            console.log("(isEditMode && duplicatePrices.length > 1) : " + (isEditMode && duplicatePrices.length > 1));
            console.log("(!isEditMode && duplicatePrices.length > 0) : " + (!isEditMode && duplicatePrices.length > 0));
            console.log("duplicatePrices.length : " + duplicatePrices.length);
            if ((isEditMode && duplicatePrices.length > 1) || (!isEditMode && duplicatePrices.length > 0)) {
                // 중복된 데이터가 여러 개일 경우 알림 추가
                if ((isEditMode && duplicatePrices.length > 2) || (!isEditMode && duplicatePrices.length > 1)) {
                    window.showToast(`기간이 중복된 데이터가 여러개 존재합니다. 기존 데이터를 수정해주세요.`, 'error');
                    return;
                }
                // 중복된 데이터를 처리하는 함수 호출
                await handleDuplicateCheck(duplicatePrices, data.priceStartDate, data.priceEndDate, data);
                return;  // 모달에서 확인 버튼을 누르기 전까지 업데이트 중단
            }

        } catch (error) {
            console.error('Duplicate check failed:', error);
            return;  // 중복 확인 실패 시 저장 중단
        }

        // 중복 데이터가 없을 경우 바로 등록/수정 API 호출
        await submitPriceData(data);
    };

    // 등록 및 수정 API 호출 함수
    const submitPriceData = async (data) => {
        try {

            console.log('🔴 data.priceCustomer', data.priceCustomer);
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
            console.log('🔴 등록/수정 Request Data to be sent:', requestData);

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
            setSelectedProduct({ productNm: '상품 선택', productCd: '', productPrice: 0 });
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

    // 🟡🟡🟡 상품 선택 시 처리
    useEffect(() => {
        if (selectedProduct && selectedProduct.productCd) {
            console.log("selectedProductCd: " + selectedProduct.productCd);

            // 상품 코드 설정
            setValue('selectedProductCd', selectedProduct.productCd, { shouldValidate: isSubmitted });

            // 가격 설정 (가격이 undefined가 아닌 경우에만 toLocaleString 적용)
            if (selectedProduct.productPrice !== undefined && selectedProduct.productPrice !== null) {
                setValue('priceCustomer', selectedProduct.productPrice.toLocaleString(), { shouldValidate: isSubmitted });
            }
        }
    }, [selectedProduct, setValue, isSubmitted]);

    // 🟡🟡🟡 수정 모드일 때 선택된 데이터 값 유지
    useEffect(() => {
        if (isEditMode) {
            setSelectedCustomer({
                customerName: priceData.customerName,
                customerNo: priceData.customerNo,
            });
            setSelectedProduct({
                productNm: priceData.productNm,
                productCd: priceData.productCd,
                productPrice: priceData.productPrice,
            });

            // 기존 가격 설정
            setValue('priceCustomer', formatPriceWithComma(priceData.priceCustomer));
        }
    }, [isEditMode, priceData, setSelectedCustomer, setSelectedProduct, setValue]);

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
        setSelectedProduct({ productNm: '상품 선택', productCd: '', productPrice: 0 });      // 상품 선택 정보 초기화
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
                        // value={selectedProduct.productPrice}
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
