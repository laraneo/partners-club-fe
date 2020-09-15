import AXIOS from "../config/Axios";
import headers from "../helpers/headers";
import Prefix from "../config/ApiPrefix";

const Person = {
  getAll(data: number, perPage: number) {
    const page = data ? data : 1;
    return AXIOS.get(`${Prefix.api}/person`, {
      params: {
        page,
        perPage
      },
      headers: headers()
    });
  },
  getAllGuest(data: number, perPage: number) {
    const page = data ? data : 1;
    return AXIOS.get(`${Prefix.api}/person-guest`, {
      params: {
        page,
        perPage
      },
      headers: headers()
    });
  },
  create(data: any) {
    return AXIOS.post(
      `${Prefix.api}/person`,
      {
        ...data
      },
      { headers: headers() }
    );
  },
  get(id: number) {
    return AXIOS.get(`${Prefix.api}/person/${id}`, { headers: headers() });
  },
  update(data: any) {
    return AXIOS.put(
      `${Prefix.api}/person/${data.id}`,
      {
        ...data
      },
      { headers: headers() }
    );
  },
  remove(id: number) {
    return AXIOS.delete(`${Prefix.api}/person/${id}`, { headers: headers() });
  },
  search(term: string) {
    return AXIOS.get(`${Prefix.api}/person-search?term=${term}`, {
      headers: headers()
    });
  },
  searchCompanyPersons(term: string) {
    return AXIOS.get(`${Prefix.api}/person-search-company`, {
      params: { term },
      headers: headers()
    });
  },
  searchPersonsByType(queryString: object) {
    return AXIOS.get(`${Prefix.api}/person-search-type`, {
      params: { ...queryString },
      headers: headers()
    });
  },
  searchByGuest(term: string) {
    return AXIOS.get(`${Prefix.api}/person-search-guest`, {
      params: { term },
      headers: headers()
    });
  },
  report() {
    return AXIOS.get(`${Prefix.api}/person-report`, { headers: headers() });
  },
  searchPersonToAssignFamily(id: any, term: string) {
    return AXIOS.get(`${Prefix.api}/search-person-to-assign-family`, {
      params: {
        term,
        id
      },
      headers: headers()
    });
  },
  assignPerson(data: any) {
    return AXIOS.post(
      `${Prefix.api}/assign-person`,
      {
        ...data
      },
      { headers: headers() }
    );
  },
  searchFamilyByPerson(id: number, term: string) {
    return AXIOS.get(`${Prefix.api}/search-family-by-person`, {
      params: {
        term,
        id
      },
      headers: headers()
    });
  },
  updateRelation(data: any) {
    return AXIOS.put(
      `${Prefix.api}/person-relation/${data.id}`,
      { ...data },
      { headers: headers() }
    );
  },
  removeRelation(id: number, base: any) {
    return AXIOS.post(`${Prefix.api}/person-relation-remove`,
      {
        id,
        base,
      },
      {headers: headers()}
    );
  },
  searchToAssign(term: string) {
    return AXIOS.get(`${Prefix.api}/search-person-to-assign`, {
      params: {
        term
      },
      headers: headers()
    });
  },
  getFamiliesPartnerByCard(card: string = "") {
    return AXIOS.get(`${Prefix.api}/get-families-partner-by-card`, {
      params: { card },
      headers: headers()
    });
  },
  getGuestByPartner(identification: string = "") {
    return AXIOS.get(`${Prefix.api}/get-guest-by-partner`, {
      params: { identification },
      headers: headers()
    });
  },
  filter(form: object, page: number, perPage: number) {
    return AXIOS.get(`${Prefix.api}/person-filter`, {
      params: { 
        page: page ? page : 1,
        perPage,
        ...form,
      },
      headers: headers()
    });
  },
  filterReport(queryString: object) {
    return AXIOS.get(`${Prefix.api}/person-filter-report`, {
      params: { ...queryString },
      headers: headers()
    });
  },
  getLockersByLocation(queryString: object) {
    return AXIOS.get(`${Prefix.api}/person-lockers-by-location`, {
      params: { ...queryString },
      headers: headers()
    });
  },

  getLockersByPartner(id: any) {
    return AXIOS.get(`${Prefix.api}/person-lockers`, {
      params: { id },
      headers: headers()
    });
  },
  getPersonsCount() {
    return AXIOS.get(`${Prefix.api}/person-count-all`, {
      headers: headers()
    });
  },
  getPersonCountByIsPartner(isPartner: number) {
    return AXIOS.get(`${Prefix.api}/person-count-by-ispartner`, {
      params: { isPartner },
      headers: headers()
    });
  },
  getPersonsExceptionStatistics() {
    return AXIOS.get(`${Prefix.api}/person-statistics-exception`, {
      headers: headers()
    });
  },
  getPersonsBirthdayStatistics() {
    return AXIOS.get(`${Prefix.api}/person-statistics-birthday`, {
      headers: headers()
    });
  },
  getPersonsBirthday(query: object, page: number, perPage: number) {
    return AXIOS.get(`${Prefix.api}/person-filter-birthday`, {
      params: { 
        ...query,
        page,
        perPage,
      },
      headers: headers()
    });
  },
};

export default Person;
