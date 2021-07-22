Listen "443" {
    ssl = {
        certificate = "conf/server.crt",
        private_key = "conf/server.key",
    },

    req_body_max = 4000,
    response_internal_error = true,
    random_cookie_id = { secret="enjoy" },

    -- query and upload configration
    Path "/conf/" {

        random_cookie_id = { check_mode=true },

        script = {
            request_headers = function() -- rewrite URL to cookie:ID
                phl.req.set_uri_path('/' .. phl.req.get_cookie('ID'))
            end,
        },

        static = { "user_confs/", enable_upload=true, },

        jump_if = { [404] = "@first" },
    },
    Path "@first" {
        echo = "-- Try some examples\n"
    },

    -- test request
    Path "/req/" {

        remove_matched_prefix = true,
        random_cookie_id = { check_mode=true },

        dynamic = {
            no_stale = true,
            safe_mode = true,
            check_interval = 1,

            get_name = function()
                -- create sub-Path() for each cookie-ID
                return phl.req.get_cookie('ID')
            end,

            get_conf = function(name)
                local f = io.open('user_confs/' .. name)
                if not f then
                    return phl.HTTP_404
                end
                local conf = f:read('*a')
                f:close()
                return conf
            end,
        }
    },

    Path "/examples/" {
        remove_matched_prefix = true,
        static = { "examples/", list_dir="plain" },
    },

    Path "/" {
        static = "statics/",
    },
}

-- for test
Listen "127.0.0.1:9091" {
    echo = "I am 9091.\n"
}
Listen "127.0.0.1:9092" {
    echo = "I am 9092.\n"
}
Listen "127.0.0.1:9093" {
    echo = "I am 9093.\n"
}
