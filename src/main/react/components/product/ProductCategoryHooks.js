// src/main/react/components/product/ProductCategoryHooks.js
import { useEffect, useState } from 'react';

export const useHooksList = () => {


  const [category, setCategory] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState([]); // 선택된 카테고리
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


  // 전체목록 조회
  useEffect(() => {
    fetch('/api/category/allPaths')
      .then(response => response.json())
      .then(data => setCategory(data))
      .catch(error => console.error('카테고리 목록을 불러오는 데 실패했습니다.', error))
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


  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // 카테고리 수정함수
  const handleEditButton = () => {
    if (selectedTopCategory || selectedMidCategory || selectedLowCategory) {
      let selectedCategory;

      if (selectedLowCategory) {
        selectedCategory = getLowCategory.find(cate => cate.categoryNo === selectedLowCategory);
      } else if (selectedMidCategory) {
        selectedCategory = getMidCategory.find(cate => cate.categoryNo === selectedMidCategory);
      } else if (selectedTopCategory) {
        selectedCategory = getTopCategory.find(cate => cate.categoryNo === selectedTopCategory);
      }

      const updateCategoryName = prompt("새로운 카테고리 명을 입력하세요", selectedCategory ? selectedCategory.categoryNm : "");// 변경 예정

      if (!updateCategoryName) {
        alert("수정이 취소되었습니다.");
        return;
      }

      fetch(`/api/category/upd/${selectedCategory.categoryNo}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          categoryNm: updateCategoryName,
          categoryLevel: selectedCategory.categoryLevel,
          categoryDeleteYn: selectedCategory.categoryDeleteYn,
          parentCategoryNo: selectedCategory.parentCategoryNo
        }),
      })
        .then(response => response.json())
        .then(data => {
          alert('카테고리가 수정되었습니다.');

          if (selectedCategory.categoryLevel === 1) {
            const updatedCategory = getTopCategory.map(cate =>
              cate.categoryNo === selectedCategory.categoryNo ? { ...cate, categoryNm: updateCategoryName } : cate
            );
            setGetTopCategory(updatedCategory);
          } else if (selectedCategory.categoryLevel === 2) {
            const updatedCategory = getMidCategory.map(cate =>
              cate.categoryNo === selectedCategory.categoryNo ? { ...cate, categoryNm: updateCategoryName } : cate
            );
            setGetMidCategory(updatedCategory);
          } else if (selectedCategory.categoryLevel === 3) {
            const updatedCategory = getLowCategory.map(cate =>
              cate.categoryNo === selectedCategory.categoryNo ? { ...cate, categoryNm: updateCategoryName } : cate
            );
            setGetLowCategory(updatedCategory);
          }
        })
        .catch(error => console.error('카테고리 수정 실패:', error));
    } else {
      alert("수정할 카테고리를 선택하세요.")
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////////

  // 카테고리 삭제함수
  const handleDeleteButton = () => {
    if (selectedTopCategory || selectedMidCategory || selectedLowCategory) {
      let selectedCategory;

      if (selectedLowCategory) {
        selectedCategory = getLowCategory.find(cate => cate.categoryNo === selectedLowCategory);
      } else if (selectedMidCategory) {
        selectedCategory = getMidCategory.find(cate => cate.categoryNo === selectedMidCategory);
      } else if (selectedTopCategory) {
        selectedCategory = getTopCategory.find(cate => cate.categoryNo === selectedTopCategory);
      }
      const checkDelete = window.confirm(`"${selectedCategory.categoryNm}" 카테고리를 삭제하시겠습니까?`);

      if (!checkDelete) {
        return;
      }

      fetch(`/api/category/del/${selectedCategory.categoryNo}`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            alert('카테고리가 삭제되었습니다.');

            if (selectedCategory.categoryLevel === 1) {
              const updatedCategory = getTopCategory.filter(cate => cate.categoryNo !== selectedCategory.categoryNo);
              setGetTopCategory(updatedCategory);
              setGetMidCategory([]); // 대분류 삭제 시 중분류 비우기
              setGetLowCategory([]);
              setSelectedTopCategory(null);
              setSelectedMidCategory(null);
              setSelectedLowCategory(null);
            } else if (selectedCategory.categoryLevel === 2) {
              const updatedCategory = getMidCategory.filter(cate => cate.categoryNo !== selectedCategory.categoryNo);
              setGetMidCategory(updatedCategory);
              setGetLowCategory([]);
              setSelectedMidCategory(null);
              setSelectedLowCategory(null);
            } else if (selectedCategory.categoryLevel === 3) {
              const updatedCategories = getLowCategory.filter(cate => cate.categoryNo !== selectedCategory.categoryNo);
              setGetLowCategory(updatedCategories);
              setSelectedLowCategory(null);
            }
          }
        })
        .catch(error => console.error('카테고리 삭제 실패:', error));
    } else {
      alert("삭제할 카테고리를 선택하세요.")
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

  // 상품 선택
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


  //카테고리 등록 버튼
  const handleAddButton = (categoryLevel) => {

    let categoryName = ''; //변경필요 때문 let사용
    let parentCategoryNo = null;

    if (categoryLevel === 1) {
      if (!insertTop.trim()) {
        alert('대분류 값을 입력하세요.')
        return;
      }
      categoryName = insertTop;

    } else if (categoryLevel === 2) {
      if (!selectedTopCategory) {
        alert('상위 카테고리를 먼저 선택하세요.')
        return;
      }
      if (!insertMid.trim()) {
        alert('중분류 값을 입력하세요.')
        return;
      }
      categoryName = insertMid;
      parentCategoryNo = selectedTopCategory;

    } else if (categoryLevel == 3) {
      if (!selectedMidCategory) {
        alert('상위 카테고리를 먼저 선택하세요.')
        return;
      }
      if (!insertLow.trim()) {
        alert('소분류 값을 입력하세요.')
        return;
      }
      categoryName = insertLow;
      parentCategoryNo = selectedMidCategory;
    }

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
        //카테고리레벨에 따른 리스트 업데이트
        if (categoryLevel === 1) {

          setGetTopCategory(prevCategory => [...prevCategory, data]);
          setInsertedTopList([...insertedTopList, data]);
          setSelectedTopCategory(data.categoryNo);
          setInsertTop('');
          alert('대분류 카테고리가 추가되었습니다.')
        } else if (categoryLevel === 2) {

          setGetMidCategory(prevCategory => [...prevCategory, data]);
          setInsertedMidList([...insertedMidList, data]);
          setSelectedMidCategory(data.categoryNo);
          setInsertMid('');
          alert('중분류 카테고리가 추가되었습니다.')
        } else if (categoryLevel === 3) {

          setGetLowCategory(prevCategory => [...prevCategory, data]);
          setInsertedLowList([...insertedLowList, data]);
          setSelectedLowCategory(data.categoryNo);
          setInsertLow('');
          alert('소분류 카테고리가 추가되었습니다.')
        }
      })
      .catch(error => {
        alert(error.message);
        console.error('카테고리 추가 실패:', error);
      });


  };


  //중분류 추가 버튼
  const handleMidAddButton = () => {
    if (!insertMid) {
      alert('중분류 값을 입력하세요')
    }
  }


  ///////////////////////////////////////////////////////////////////////////////////////////////////


  // 모달 열기
  const openModal = () => {
    setShowModal(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
  };

  // 대분류 li 선택했을 떄
  function handleTopClick(categoryNo) {
    if (selectedTopCategory === categoryNo) {
      return;  // 같은 항목을 클릭하면 아무 동작도 하지 않음
    } else {
      setSelectedTopCategory(categoryNo);  // 선택된 대분류만 상태에 반영
      setSelectedMidCategory(null);  // 중분류와 소분류는 초기화
      setSelectedLowCategory(null);
    }
  }

  useEffect(() => {
    if (selectedTopCategory) {
      console.log("선택된 대분류 번호: " + selectedTopCategory);
    } else {
      console.log("대분류가 해제되었습니다.");
    }
  }, [selectedTopCategory]);


  // 중분류 li 선택했을 때
  function handleMidClick(categoryNo) {
    if (selectedMidCategory === categoryNo) {
      setSelectedMidCategory(null);
      setSelectedLowCategory(null);
    } else {
      setSelectedMidCategory(categoryNo);
      setSelectedLowCategory(null);
    }
  }
  useEffect(() => {
    if (selectedMidCategory) {
      console.log("선택된 중분류 번호:" + selectedMidCategory);
    } else {
      console.log("중분류가 해제되었습니다.");
    }
  }, [selectedMidCategory]);


  //소분류 li 를 선택했을 때
  function handleLowClick(categoryNo) {
    if (selectedLowCategory === categoryNo) {
      setSelectedLowCategory(null);
    } else {
      setSelectedLowCategory(categoryNo);
    }
  }
  useEffect(() => {
    if (selectedLowCategory) {
      console.log("선택된 소분류 번호:" + selectedLowCategory);
    } else {
      console.log("소분류가 해제되었습니다.");
    }
  }, [selectedLowCategory]);


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
  };

};