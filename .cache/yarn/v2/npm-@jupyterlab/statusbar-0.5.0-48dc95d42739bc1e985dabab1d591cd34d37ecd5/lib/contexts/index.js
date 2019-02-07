"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IStatusContext;
(function (IStatusContext) {
    function findContext(widget, contexts) {
        return contexts.find((context) => {
            return context.tracker.has(widget);
        });
    }
    function delegateActive(shell, contexts) {
        return () => {
            const currentWidget = shell.currentWidget;
            if (currentWidget !== null) {
                const context = findContext(currentWidget, contexts);
                return (!!context &&
                    (context.isEnabled
                        ? context.isEnabled(currentWidget)
                        : true));
            }
            else if (contexts.length === 0) {
                return true;
            }
            else {
                return false;
            }
        };
    }
    IStatusContext.delegateActive = delegateActive;
})(IStatusContext = exports.IStatusContext || (exports.IStatusContext = {}));
