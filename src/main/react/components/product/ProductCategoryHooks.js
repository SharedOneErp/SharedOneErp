// src/main/react/components/product/ProductCategoryHooks.js
import { useEffect, useState } from 'react';
import axios from 'axios';

export const useHooksList = () => {

  const [isLoading, setLoading] = useState(true); // 로딩 상태 관리

  const [category, setCategory] = useState([]);
  const [categoryName, setCategoryName] = useState('');

  const [categoryLevel, setCategoryLevel] = useState('대분류'); // 카테고리 레벨 (대분류/중분류/소분류)

  // 모달 관련
  const [showModal, setShowModal] = useState(false);

  //대분류조회  //중분류조회  //소분류조회
  const [getTopCategory, setGetTopCategory] = useState([]);
  const [getMidCategory, setGetMidCategory] = useState([]);
  const [getLowCategory, setGetLowCategory] = useState([]);

  //새로운 카테고리 등록
  const [insertTop, setInsertTop] = useState('');//대분류 추가
  const [insertMid, setInsertMid] = useState('');//중분류 추가
  const [insertLow, setInsertLow] = useState('');//소분류 추가

  //선택된 카테고리 저장
  const [selectedTopCategory, setSelectedTopCategory] = useState(null);
  const [selectedMidCategory, setSelectedMidCategory] = useState(null);
  const [selectedLowCategory, setSelectedLowCategory] = useState(null);

  // 새로 추가된 카테고리 리스트를 저장
  const [insertedTopList, setInsertedTopList] = useState([]);
  const [insertedMidList, setInsertedMidList] = useState([]);
  const [insertedLowList, setInsertedLowList] = useState([]);

  // 선택 카테고리 호버 저장
  const [hoverTop, setHoverTop] = useState(null);
  const [hoverMid, setHoverMid] = useState(null);
  const [hoverLow, setHoverLow] = useState(null);

  // 모든 카테고리 조회
  const [allCategories, setAllCategories] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [midCategories, setMidCategories] = useState([]);
  const [lowCategories, setLowCategories] = useState([]);

  // 선택된 카테고리
  const [selectedCategory, setSelectedCategory] = useState([{
    top: '',
    middle: '',
    low: ''
  }]);



  // 전체목록 조회
  useEffect(() => {
    fetch('/api/category/allPaths')
      .then(response => response.json())
      .then(data => {
        setCategory(data);   // 카테고리 데이터 설정
        setLoading(false); // 로딩 완료 후 false로 설정
      })
      .catch(error => {
        console.error('카테고리 목록을 불러오는 데 실패했습니다.', error);
        setLoading(false); // 에러 발생 시에도 로딩 상태 false로 설정
      });
  }, []);

  // 대분류 조회
  useEffect(() => {
    fetch('/api/category/top')
      .then(response => response.json())
      .then(data => {
        // console.log(data);
        const topCategory = Array.isArray(data) ? data : [data];
        setGetTopCategory(topCategory);
        if (topCategory.length > 0) {
          setSelectedTopCategory(topCategory[0].categoryNo);
        }
      })
      .catch(error => console.error('대분류 목록을 불러오는데 실패했습니다.', error));
  }, []);

  // 중분류 조회
  useEffect(() => {
    if (selectedTopCategory) {
      setGetLowCategory([]);
      fetch(`/api/category/middle/${selectedTopCategory}`)
        .then(response => response.json())
        .then(data => {
          const midCategory = Array.isArray(data) ? data : [data];
          setGetMidCategory(midCategory);
          setSelectedMidCategory(null);
        })
        .catch(error => console.error('중분류 목록을 불러오는데 실패했습니다.', error));
    } else {
      setGetLowCategory([]);
    }
  }, [selectedTopCategory]);


  //소분류 조회
  useEffect(() => {
    if (selectedTopCategory && selectedMidCategory) {
      fetch(`api/category/low/${selectedMidCategory}/${selectedTopCategory}`)
        .then(response => response.json())
        .then(data => {
          const lowCategory = Array.isArray(data) ? data : [data];
          setGetLowCategory(lowCategory);
          setSelectedLowCategory(null);
        })
        .catch(error => console.error('소분류 목록을 불러오는데 실패했습니다.', error));
    } else {
      setGetLowCategory([]);
    }
  }, [selectedTopCategory, selectedMidCategory]);


  //모든 카테고리 조회
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await axios.get('/api/category/all');
        const categories = response.data;
        console.log("전체 카테고리 데이터:", categories);

        setAllCategories(categories);

        const top = categories.filter(cat => !cat.parentCategoryNo);
        setTopCategories(top);
        console.log("대분류:", top);

        const mid = categories.filter(cat => cat.parentCategoryNo && top.some(topCate => topCate.categoryNo === cat.parentCategoryNo));
        setMidCategories(mid);
        console.log("중분류:", mid);

        const low = categories.filter(cat => {
          const middleCate = mid.find(m => m.categoryNo === cat.parentCategoryNo);
          return middleCate && top.some(topCate => topCate.categoryNo === middleCate.parentCategoryNo);
        });
        setLowCategories(low);
        console.log("소분류:", low);

      } catch (error) {
        console.error('모든 카테고리 가져오기 실패:', error);
      }
    };

    fetchAllCategories();
  }, []);

  // 🟡 대분류 변경 시 중분류 필터링
  useEffect(() => {
    console.log("대분류 변경 시 selectedCategory.top:", selectedCategory.top);
    if (selectedCategory.top) {
      // selectedCategory.top을 숫자로 변환
      const filteredMiddle = allCategories.filter(cat => cat.parentCategoryNo === selectedCategory.top);
      console.log("필터링된 중분류:", filteredMiddle);
      setMidCategories(filteredMiddle);
    } else {
      setMidCategories([]);
    }
    setLowCategories([]);
  }, [selectedCategory.top, allCategories]);

  // 🟡 중분류 변경 시 소분류 필터링
  useEffect(() => {
    if (selectedCategory.middle) {
      const filteredLow = allCategories.filter(cat => cat.parentCategoryNo === selectedCategory.middle);
      console.log("필터링된 소분류:", filteredLow);
      setLowCategories(filteredLow);
    } else {
      setLowCategories([]);
    }
  }, [selectedCategory.middle, allCategories]);







  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // 카테고리 수정함수
  const handleEditButton = () => {
    if (selectedCategory.top || selectedCategory.middle || selectedCategory.low) {
      let selectedCate = null;

      if (selectedCategory.low) {
        selectedCate = lowCategories.find(cate => cate.categoryNo === selectedCategory.low);
      } else if (selectedCategory.middle) {
        selectedCate = midCategories.find(cate => cate.categoryNo === selectedCategory.middle);
      } else if (selectedCategory.top) {
        selectedCate = topCategories.find(cate => cate.categoryNo === selectedCategory.top);
      }


      // 수정할 카테고리가 없으면 경고 메시지 출력
      if (!selectedCate) {
        window.showToast("수정할 카테고리를 선택하세요.", "error");
        return;
      }

      const updateCategoryName = prompt("새로운 카테고리 명을 입력하세요", selectedCate ? selectedCate.categoryNm : "");

      if (!updateCategoryName || updateCategoryName.trim() === "") {
        window.showToast("수정이 취소되었습니다.");
        return;
      }

      fetch(`/api/category/upd/${selectedCate.categoryNo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryNm: updateCategoryName.trim(),
          categoryLevel: selectedCate.categoryLevel,
          categoryDeleteYn: selectedCate.categoryDeleteYn,
          parentCategoryNo: selectedCate.parentCategoryNo
        }),
      })
        .then(response => {
          if (!response.ok) {
            return response.json().then(error => {
              throw new Error(error.message);
            });
          }
          // 수정 성공 메시지 출력
          window.showToast('카테고리가 수정되었습니다.');

          // 대분류 중분류 소분류에 따라 상태를 업데이트
          const updateCategoryList = (categories, setCategories) => {
            const updatedCategories = categories.map(cate =>
              cate.categoryNo === selectedCate.categoryNo ? { ...cate, categoryNm: updateCategoryName } : cate
            );
            setCategories(updatedCategories);
          };

          // 수정된 카테고리 레벨에 따라 상태 업데이트
          if (selectedCate.categoryLevel === 1) {
            updateCategoryList(topCategories, setTopCategories);

            // 전체 카테고리 배열(allCategories) 업데이트
            setAllCategories(prevCategories => prevCategories.map(cate =>
              cate.categoryNo === selectedCate.categoryNo ? { ...cate, categoryNm: updateCategoryName } : cate
            ));

            //수정 후 모든 카테고리에서 중분류와 소분류를 다시 필터링
            const filteredMidCategories = allCategories.filter(cate => cate.parentCategoryNo === selectedCate.categoryNo);
            setMidCategories(filteredMidCategories);
            setLowCategories([]);

          } else if (selectedCate.categoryLevel === 2) {
            updateCategoryList(midCategories, setMidCategories);

            // 전체 카테고리 배열(allCategories) 업데이트
            setAllCategories(prevCategories => prevCategories.map(cate =>
              cate.categoryNo === selectedCate.categoryNo ? { ...cate, categoryNm: updateCategoryName } : cate
            ));

          } else if (selectedCate.categoryLevel === 3) {
            updateCategoryList(lowCategories, setLowCategories);

            // 전체 카테고리 배열(allCategories) 업데이트
            setAllCategories(prevCategories => prevCategories.map(cate =>
              cate.categoryNo === selectedCate.categoryNo ? { ...cate, categoryNm: updateCategoryName } : cate
            ));
          }
        })
        .catch(error => {
          console.error('카테고리 수정 실패:', error);
          window.showToast('카테고리 수정 중 오류가 발생했습니다.', "error");
        });

    } else {
      window.showToast("수정할 카테고리를 선택하세요.", "error");
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  // 카테고리 삭제함수
  const handleDeleteButton = () => {
    if (selectedCategory.top || selectedCategory.middle || selectedCategory.low) {
      let selectedCate = null; // selectedCategory와 충돌 방지

      // 선택된 카테고리 찾기
      if (selectedCategory.low) {
        selectedCate = lowCategories.find(cate => cate.categoryNo === selectedCategory.low);
      } else if (selectedCategory.middle) {
        selectedCate = midCategories.find(cate => cate.categoryNo === selectedCategory.middle);
      } else if (selectedCategory.top) {
        selectedCate = topCategories.find(cate => cate.categoryNo === selectedCategory.top);
      }

      window.confirmCustom(`"${selectedCate.categoryNm}" 카테고리를 삭제하시겠습니까?`).then(result => {
        if (result) {
          // 삭제 요청
          fetch(`/api/category/del/${selectedCate.categoryNo}`, {
            method: 'DELETE',
          })
            .then(response => {
              if (response.ok) {
                window.showToast('카테고리가 삭제되었습니다.');

                // 전체 카테고리 배열(allCategories)에서 삭제된 카테고리 제거
                setAllCategories(prevCategories =>
                  prevCategories.filter(cate => cate.categoryNo !== selectedCate.categoryNo)
                );

                if (selectedCate.categoryLevel === 1) {
                  const updatedCategory = topCategories.filter(cate => cate.categoryNo !== selectedCate.categoryNo);
                  setTopCategories(updatedCategory);
                  setMidCategories([]); // 대분류 삭제 시 중분류 초기화
                  setLowCategories([]);
                  setSelectedCategory(prev => ({
                    ...prev,
                    top: null,
                    middle: null,
                    low: null
                  }));
                } else if (selectedCate.categoryLevel === 2) {
                  const updatedCategory = midCategories.filter(cate => cate.categoryNo !== selectedCate.categoryNo);
                  setMidCategories(updatedCategory);
                  setLowCategories([]);
                  setSelectedCategory(prev => ({
                    ...prev,
                    middle: null,
                    low: null
                  }));
                } else if (selectedCate.categoryLevel === 3) {
                  const updatedCategories = lowCategories.filter(cate => cate.categoryNo !== selectedCate.categoryNo);
                  setLowCategories(updatedCategories);
                  setSelectedCategory(prev => ({
                    ...prev,
                    low: null
                  }));
                }
              }
            })
            .catch(error => console.error('카테고리 삭제 실패:', error));
        }
      });

    } else {
      window.showToast("삭제할 카테고리를 선택하세요.", "error");
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // 체크표시 state
  const [products, setProducts] = useState([]); // 전체 상품 목록
  const [selectedProducts, setSelectedProducts] = useState([]); // 체크된 상품 목록


  // 전체 선택 체크표시
  const handleAllSelectCategory = (checked) => {
    if (checked) {
      const allProductCds = products.map(product => product.productCd);
      setSelectedProducts(allProductCds);
    } else {
      setSelectedProducts([]);
    }
  };

  //

  // 카테고리 선택
  const handleSelectCategory = (categoryNo) => {
    setSelectedProducts(prevSelected => {
      if (prevSelected.includes(categoryNo)) {
        return prevSelected.filter(cd => cd !== categoryNo);
      } else {
        const newSelectedCategory = [...prevSelected, categoryNo];
        console.log('선택된 카테고리', newSelectedCategory);
        return newSelectedCategory;
      }
    });
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  //대중소분류 추가 함수

  const handleInsert = (e, categoryLevel) => {
    const value = e.target.value; // 3 카테고리를 동시 관리 위함

    if (categoryLevel === 1) {
      setInsertTop(value);
    } else if (categoryLevel === 2) {
      setInsertMid(value);
    } else if (categoryLevel === 3) {
      setInsertLow(value);
    }
  }

  // 상태 변수를 추가하여 중복 요청 방지
  const [isSubmitting, setIsSubmitting] = useState(false);

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  // 🔴 카테고리 등록 함수
  const handleAddButton = (categoryLevel) => {
    if (isSubmitting) {
      return; // 이미 요청 중일 때는 추가 요청을 막음
    }

    let categoryName = '';
    let parentCategoryNo = null;

    if (categoryLevel === 1) {
      if (!insertTop.trim()) {
        window.showToast('대분류 값을 입력하세요.', "error");
        return;
      }
      categoryName = insertTop;

    } else if (categoryLevel === 2) {
      if (!selectedCategory.top) {
        window.showToast('상위 카테고리를 먼저 선택하세요.', "error");
        return;
      }
      if (!insertMid.trim()) {
        window.showToast('중분류 값을 입력하세요.', "error");
        return;
      }
      categoryName = insertMid;
      parentCategoryNo = selectedCategory.top;

    } else if (categoryLevel === 3) {
      if (!selectedCategory.middle) {
        window.showToast('상위 카테고리를 먼저 선택하세요.', "error");
        return;
      }
      if (!insertLow.trim()) {
        window.showToast('소분류 값을 입력하세요.', "error");
        return;
      }
      categoryName = insertLow;
      parentCategoryNo = selectedCategory.middle;
    }

    // 요청 중 상태로 설정
    setIsSubmitting(true);

    fetch('/api/category/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        categoryNm: categoryName,
        categoryLevel: categoryLevel,
        parentCategoryNo: parentCategoryNo
      }),
    })
      .then(response => {
        if (!response.ok) {
          return response.json().then(error => {
            throw new Error(error.message);
          });
        }
        return response.json();
      })
      .then(data => {
        // 전체 카테고리 리스트에 새로 추가된 카테고리 반영
        setAllCategories(prevCategories => [...prevCategories, data]);

        // 카테고리 레벨에 따른 리스트 업데이트
        if (categoryLevel === 1) {
          setTopCategories(prevCategory => [...prevCategory, data]);

          // 기존배열에 바로 반영함
          setSelectedCategory(prev => ({
            ...prev,
            top: data.categoryNo,
            middle: '',
            low: ''
          })); // 등록 시 업데이트
          setInsertTop('');
          window.showToast('대분류 카테고리가 추가되었습니다.');

        } else if (categoryLevel === 2) {
          setMidCategories(prevCategory => [...prevCategory, data]);

          setSelectedCategory(prev => ({ ...prev, middle: data.categoryNo }));
          setInsertMid('');
          window.showToast('중분류 카테고리가 추가되었습니다.');

        } else if (categoryLevel === 3) {
          setLowCategories(prevCategory => [...prevCategory, data]);

          setSelectedCategory(prev => ({ ...prev, low: data.categoryNo }));
          setInsertLow('');
          window.showToast('소분류 카테고리가 추가되었습니다.');
        }
      })
      .catch(error => {
        window.showToast(error.message, "error");
        console.error('카테고리 추가 실패:', error);
      })
      .finally(() => {
        // 요청 완료 후 상태를 false로 변경하여 다시 요청할 수 있게 함
        setIsSubmitting(false);
      });
  };



  //중분류 추가 버튼
  const handleMidAddButton = () => {
    if (!insertMid) {
      window.showToast('중분류 값을 입력하세요', "error")
    }
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////


  // 🟡 모달 열기
  const openModal = () => {
    setShowModal(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
  };

  // 대분류 li 선택했을 때
  function handleTopClick(categoryNo) {
    setSelectedCategory(prev => ({
      ...prev,
      top: prev.top === categoryNo ? '' : categoryNo, // 선택 : 선택해제
      middle: '',
      low: ''
    }));
  }

  useEffect(() => {
    console.log(selectedCategory.top ? `선택된 대분류 번호: ${selectedCategory.top}` : '대분류가 해제되었습니다.');
  }, [selectedCategory.top]);

  // 중분류 li 선택했을 때
  function handleMidClick(categoryNo) {
    setSelectedCategory(prev => ({
      ...prev,
      middle: prev.middle === categoryNo ? '' : categoryNo, // 선택 : 선택해제
      low: '' // 소분류 초기화
    }));
  }

  useEffect(() => {
    console.log(selectedCategory.middle ? `선택된 중분류 번호: ${selectedCategory.middle}` : '중분류가 해제되었습니다.');
  }, [selectedCategory.middle]);

  // 소분류 li 선택했을 때
  function handleLowClick(categoryNo) {
    setSelectedCategory(prev => ({
      ...prev,
      low: prev.low === categoryNo ? '' : categoryNo // 선택 : 선택해제
    }));
  }

  useEffect(() => {
    console.log(selectedCategory.low ? `선택된 소분류 번호: ${selectedCategory.low}` : '소분류가 해제되었습니다.');
  }, [selectedCategory.low]);



  // 클릭 hover저장
  function handleTopHover(categoryNo) {
    setHoverTop(categoryNo);
  }
  function handleMidHover(categoryNo) {
    setHoverMid(categoryNo);
  }
  function handleLowHover(categoryNo) {
    setHoverLow(categoryNo);
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////

  // 대분류와 중분류의 열림/닫힘 상태를 저장하는 상태값
  const [collapsed, setCollapsed] = useState([]);
  const [collapsedTwo, setCollapsedTwo] = useState([]);

  // 대분류 클릭 시 열림/닫힘 상태 토글
  const toggleCollapse = (one) => {
    if (collapsed.includes(one)) {
      setCollapsed(collapsed.filter(item => item !== one));
    } else {
      setCollapsed([...collapsed, one]);
    }
  };

  // 중분류 클릭 시 열림/닫힘 상태 토글
  const toggleCollapseTwo = (two) => {
    if (collapsedTwo.includes(two)) {
      setCollapsedTwo(collapsedTwo.filter(item => item !== two));
    } else {
      setCollapsedTwo([...collapsedTwo, two]);
    }
  };

  // 대분류 모두 접기/펼치기
  const toggleAllCollapse = () => {
    if (collapsed.length === category.filter(cat => cat.categoryLevel === 1).length) {
      setCollapsed([]); // 모두 펼쳐졌다면 모두 접기
    } else {
      setCollapsed(category.filter(cat => cat.categoryLevel === 1).map(cat => cat.one)); // 모두 접기
    }
  };

  // 중분류 모두 접기/펼치기
  const toggleAllCollapseTwo = () => {
    if (collapsedTwo.length === category.filter(cat => cat.categoryLevel === 2).length) {
      setCollapsedTwo([]); // 모두 펼쳐졌다면 모두 접기
    } else {
      setCollapsedTwo(category.filter(cat => cat.categoryLevel === 2).map(cat => cat.two)); // 모두 접기
    }
  };

  // 🟢 모달 배경 클릭 시 창 닫기
  const handleBackgroundClick = (e) => {
    if (e.target.className === 'modal_overlay') {
      closeModal();
    }
  };


  return {
    category,
    categoryName,
    selectedCategory,
    categoryLevel,
    showModal,
    getTopCategory,
    getMidCategory,
    getLowCategory,
    insertTop,
    insertMid,
    insertLow,
    selectedTopCategory,
    selectedMidCategory,
    selectedLowCategory,
    insertedTopList,
    insertedMidList,
    insertedLowList,
    hoverTop,
    hoverMid,
    hoverLow,
    collapsed,
    collapsedTwo,
    isSubmitting,
    allCategories,
    topCategories,
    midCategories,
    lowCategories,
    toggleCollapse,
    toggleCollapseTwo,
    toggleAllCollapse,
    toggleAllCollapseTwo,
    handleEditButton,
    handleDeleteButton,
    handleAllSelectCategory,
    handleSelectCategory,
    handleInsert,
    handleAddButton,
    openModal,
    closeModal,
    setSelectedTopCategory,
    setSelectedMidCategory,
    setSelectedLowCategory,
    handleTopClick,
    handleMidClick,
    handleLowClick,
    handleTopHover,
    handleBackgroundClick,
    setAllCategories,
    setTopCategories,
    setMidCategories,
    setLowCategories,
    setSelectedCategory,
    isLoading,
  };
};