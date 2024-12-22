declare module '@/services/firebase.config.js' {
  import {
    Firestore,
    CollectionReference,
    DocumentData,
    Query,
    QueryConstraint,
    QuerySnapshot,
  } from 'firebase/firestore'
  import { FirebaseStorage, StorageReference, UploadResult, UploadMetadata } from 'firebase/storage'

  const firestore: Firestore
  const storage: FirebaseStorage

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

  function ref(storage: FirebaseStorage, path: string): StorageReference

  function doc<T = DocumentData>(firestore: Firestore, path: string): DocumentReference<T>
  function getDoc<T = DocumentData>(docRef: DocumentReference<T>): Promise<DocumentSnapshot<T>>
  function updateDoc<T = DocumentData>(
    docRef: DocumentReference<T>,
    data: Partial<T>,
  ): Promise<void>

  function uploadBytes(
    ref: StorageReference,
    data: Blob | Uint8Array | ArrayBuffer,
    metadata?: UploadMetadata,
  ): Promise<UploadResult>

  function getDownloadURL(ref: StorageReference): Promise<string>

  export {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    getDoc,
    doc,
    firestore,
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
  }
}
