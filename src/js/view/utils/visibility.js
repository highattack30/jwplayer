export default function getVisibility(model, element, bounds) {
    // Set visibility to 1 if we're in fullscreen
    if (model.get('fullscreen')) {
        return 1;
    }

    // Set visibility to 0 if we're not in the active tab
    if (!model.get('activeTab')) {
        return 0;
    }
    // Otherwise, set it to the intersection ratio reported from the intersection observer
    var intersectionRatio = model.get('intersectionRatio');

    if (intersectionRatio === undefined) {
        // Get intersectionRatio through brute force
        intersectionRatio = computeVisibility(element, bounds);
    }

    return intersectionRatio;
}

function computeVisibility(target, bounds) {
    var html = document.documentElement;
    var body = document.body;
    var rootRect = {
        top: 0,
        left: 0,
        right: html.clientWidth || body.clientWidth,
        width: html.clientWidth || body.clientWidth,
        bottom: html.clientHeight || body.clientHeight,
        height: html.clientHeight || body.clientHeight
    };

    if (!body.contains(target)) {
        return 0;
    }
    var targetRect = target.getBoundingClientRect();

    var intersectionRect = targetRect;
    var parent = target.parentNode;
    var atRoot = false;

    while (!atRoot) {
        var parentRect = null;
        if (!parent || parent.nodeType !== 1) {
            atRoot = true;
            parentRect = rootRect;
        } else if (window.getComputedStyle(parent).overflow !== 'visible') {
            parentRect = bounds(parent);
        }
        if (parentRect) {
            intersectionRect = computeRectIntersection(parentRect, intersectionRect);
            if (!intersectionRect) {
                return 0;
            }
        }
        parent = parent.parentNode;
    }
    var targetArea = targetRect.width * targetRect.height;
    var intersectionArea = intersectionRect.width * intersectionRect.height;
    return targetArea ? (intersectionArea / targetArea) : 0;
}

function computeRectIntersection(rect1, rect2) {
    var top = Math.max(rect1.top, rect2.top);
    var bottom = Math.min(rect1.bottom, rect2.bottom);
    var left = Math.max(rect1.left, rect2.left);
    var right = Math.min(rect1.right, rect2.right);
    var width = right - left;
    var height = bottom - top;
    return (width >= 0 && height >= 0) && {
        top: top,
        bottom: bottom,
        left: left,
        right: right,
        width: width,
        height: height
    };
}
