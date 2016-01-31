(function () {

    var title = document.querySelector('.js-title');
    var form = document.querySelector('.js-form');
    var inputFrom = form.querySelector('.js-from');
    var inputTo = form.querySelector('.js-to');
    var result = document.querySelector('.js-result');

    var queryParams = parseQueryParams();
    var initialState =  {
        from: parseInt(queryParams.from) || 0,
        to: parseInt(queryParams.to) || 100,
        result: 0
    };

    var store = createStore(reduceState, initialState, stateChanged);

    form.addEventListener('submit', function (e) {
        e.preventDefault();
    });

    form.addEventListener('change', function (e) {
        e.preventDefault();

        store.update({
            from: parseInt(inputFrom.value),
            to: parseInt(inputTo.value)
        });
    });

    function reduceState (state) {
        state.result = getRandomNumber(state.from, state.to);

        return state;
    }

    function stateChanged (state) {
        renderPageTitle(state);
        updateHistory(state);
        renderState(state);
    }

    function updateHistory (state) {
        var path = location.pathname + '?';
        path += ['from', 'to'].map(function (paramName) {
            return paramName + '=' + encodeURIComponent(state[paramName]);
        }).join('&');

        history.replaceState({}, document.title, path);
    }

    function renderPageTitle (state) {
        title.textContent = state.result + ' - Random Number';
    }

    function renderState (state) {
        inputFrom.value = state.from;
        inputTo.value = state.to;

        result.textContent = state.result;
    }

    function getRandomNumber (f, t) {
        return Math.floor((Math.random() * ((t + 1) - f)) + f);
    }

    function parseQueryParams () {
        return location.search
            .replace(/^\?/, '')
            .split('&')
            .reduce(function (params, queryPart) {
                var parts = queryPart.split('=');

                params[parts[0]] = decodeURIComponent(parts[1]);

                return params;
            }, {});
    }

    ///////////////

    function createStore (reducer, initialState, subscriber) {
        var storeState = {};

        update(initialState);

        return {
            update: update
        };

        ///////////////

        function update (state) {
            storeState = extend({}, storeState, state);

            subscriber(reducer(extend({}, state)));
        }
    }

    function extend (object/*, ...sources*/) {
        var sources = Array.prototype.slice.call(arguments, 1);

        sources.forEach(function (source) {
            Object.keys(source).forEach(function (key) {
                object[key] = source[key];
            });
        });

        return object;
    }

})();
