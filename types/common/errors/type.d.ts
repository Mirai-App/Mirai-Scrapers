type Result<T, E> = {
  Ok?: {
    value: T;
  };
  Err?: E;

  isOk: () => boolean;
  isErr: () => boolean;
};
