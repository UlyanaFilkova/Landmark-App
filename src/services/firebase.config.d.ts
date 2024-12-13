declare module '@/services/firebase.config.js' {
  import {
    Firestore,
    CollectionReference,
    DocumentData,
    Query,
    QueryConstraint,
    QuerySnapshot,
  } from 'firebase/firestore'

  const firebase: Firestore

  function collection<T = DocumentData>(firestore: Firestore, path: string): CollectionReference<T>

  function addDoc<T = DocumentData>(ref: CollectionReference<T>, data: T): Promise<{ id: string }>

  function query<T = DocumentData>(
    collectionRef: CollectionReference<T>,
    ...queryConstraints: QueryConstraint[]
  ): Query<T>

  function where(
    fieldPath: string,
    opStr:
      | '<'
      | '<='
      | '=='
      | '!='
      | '>='
      | '>'
      | 'array-contains'
      | 'in'
      | 'array-contains-any'
      | 'not-in',
    value: unknown,
  ): QueryConstraint

  function getDocs<T = DocumentData>(query: Query<T>): Promise<QuerySnapshot<T>>

  export { firebase, collection, addDoc, query, where, getDocs }
}
