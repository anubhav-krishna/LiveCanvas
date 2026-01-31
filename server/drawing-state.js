  const operations = [];

  const redoStack = [];

  function addOperation(op) {
    operations.push(op);
    redoStack.length = 0; //No need for redo after new operation
  }

  function undoGlobal() {
    if (operations.length === 0) return null;
    const op = operations.pop();
    redoStack.push(op);
    return op;
  }

  function undoUser(userId) {
    for (let i = operations.length - 1; i >= 0; i--) {
      const op = operations[i];
        if (op.userId === userId) {
        operations.splice(i, 1);
        redoStack.push(op);
        return op;
      }
    }
    return null;
  }

  function redo(){
    if (redoStack.length === 0) return null;
    const op = redoStack.pop();
    operations.push(op);
    return op;
  }

  function getState() {
    return operations;
  }

  export {
    addOperation,
    undoGlobal,
    undoUser,  
    redo,
    getState
  };