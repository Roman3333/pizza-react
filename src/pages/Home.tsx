import React, { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';

import Categories from '../components/Categories';
import Pagination from '../components/Pagination';
import PizzaItem from '../components/PizzaItem';
import { Skeleton } from '../components/PizzaItem/PizzaItemSkeleton';
import Sort, { list } from '../components/Sort';

import { changeCategory, changePage, changeFilters } from '../redux/filter/slice';
import { useAppDispatch } from '../redux/store';
import { fetchPizzas } from '../redux/pizza/slice';
import { RootState } from '../redux/store';
import { SearchPizzaParams } from '../redux/pizza/types';

const Home: React.FC = () => {
  const isMounted = useRef(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { categoryId, sort, currentPage, searchValue } = useSelector(
    (state: RootState) => state.filters,
  );
  const { items, isLoading } = useSelector((state: RootState) => state.pizzas);

  const onChangeCategory = useCallback((id: number) => {
    dispatch(changeCategory(id));
  }, []);

  const onChangePage = (id: number) => {
    dispatch(changePage(id));
  };

  const getPizzas = async () => {
    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes('-') ? 'asc' : 'desc';
    const category = categoryId > 0 ? String(categoryId) : '';
    const search = searchValue;

    dispatch(
      fetchPizzas({
        sortBy,
        order,
        category,
        search,
        currentPage: String(currentPage),
      }),
    );

    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (window.location.search) {
      const qsParams = qs.parse(
        window.location.search.substring(1),
      ) as unknown as SearchPizzaParams;
      const sort = list.find((obj) => obj.sortProperty === qsParams.sortBy);
      dispatch(
        changeFilters({
          searchValue: qsParams.search,
          categoryId: Number(qsParams.category),
          currentPage: Number(qsParams.currentPage),
          sort: sort || list[0],
        }),
      );
      console.log(qsParams);
    }
  }, []);

  // ???????? ???????????????? ?????????????????? ?? ?????? ???????????? ????????????
  useEffect(() => {
    if (isMounted.current) {
      const qsParams = qs.stringify({
        categoryId: categoryId > 0 ? categoryId : null,
        sort: sort.sortProperty,
        currentPage,
      });

      console.log(qsParams);
      navigate(`?${qsParams}`);
    }

    // if (isMounted.current) {
    // const params = {
    //   categoryId: categoryId > 0 ? categoryId : null,
    //   sortProperty: sort.sortProperty,
    //   currentPage,
    // };

    // const queryString = qs.stringify(params, { skipNulls: true });

    // navigate(`/?${queryString}`);
    // }

    // const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams;
    // const sortObj = list.find((obj) => obj.sortProperty === params.sortBy);
    // dispatch(
    //   changeFilters({
    //     searchValue: params.search,
    //     categoryId: Number(params.category),
    //     currentPage: Number(params.currentPage),
    //     sort: sortObj || list[0],
    //   }),
    // );

    getPizzas();
    isMounted.current = true;
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  // ???????? ?????? ???????????? ???????????? ???? ?????????????????? url-?????????????????? ?? ??????????????????  ?? ????????????
  // React.useEffect(() => {
  //   if (window.location.search) {
  //     const params = qs.parse(window.location.search.substring(1)) as unknown as SearchPizzaParams;
  //     const sort = list.find((obj) => obj.sortProperty === params.sortBy);
  //     dispatch(
  //       changeFilters({
  //         searchValue: params.search,
  //         categoryId: Number(params.category),
  //         currentPage: Number(params.currentPage),
  //         sort: sort || list[0],
  //       }),
  //     );
  //   }
  //   isSearch.current = true;
  // }, []);

  //???????? ?????? ???????????? ????????????, ???? ?????????????????????? ??????????
  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   if (!isSearch.current) {
  //     getPizzas();
  //   }
  // isSearch.current = false;
  // }, []);

  return (
    <div className="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={onChangeCategory} />
        <Sort value={sort} />
      </div>
      <h2 className="content__title">?????? ??????????</h2>

      {isLoading === 'error' ? (
        <div style={{ marginBottom: 30 + 'px', textAlign: 'center' }}>
          <h2>???????????????? ????????????</h2>
          <div>???? ?????????????? ?????????????????? ??????????</div>
        </div>
      ) : (
        <div className="content__items">
          {isLoading === 'loading'
            ? [...new Array(6)].map((_, index) => <Skeleton key={index} />)
            : items.map((item) => {
                return <PizzaItem {...item} key={item.id} />;
              })}
        </div>
      )}

      <Pagination onChangePage={(i) => onChangePage(i)} currentPage={currentPage} />
    </div>
  );
};

export default Home;
