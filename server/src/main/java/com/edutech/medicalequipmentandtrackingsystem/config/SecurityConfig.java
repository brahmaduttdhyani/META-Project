package com.edutech.medicalequipmentandtrackingsystem.config;
 
import com.edutech.medicalequipmentandtrackingsystem.jwt.JwtRequestFilter;
import com.edutech.medicalequipmentandtrackingsystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
 
 
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Autowired
    private JwtRequestFilter authFilter;
 
    @Bean
    public UserDetailsService userDetailsService() {
        return new UserService();
    }
 
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http.cors().and().csrf().disable()
            .authorizeRequests()
            .antMatchers("/api/user/login").permitAll()
            .antMatchers("/api/user/register").permitAll()
            .antMatchers("/api/otp/send").permitAll()
            .antMatchers("/api/otp/verify").permitAll()
            .antMatchers("/api/password/send-otp").permitAll()
            .antMatchers("/api/password/verify-otp").permitAll()
            .antMatchers("/api/password/reset-password").permitAll()
            .antMatchers(HttpMethod.POST,"/api/hospital/create").hasAuthority("HOSPITAL")
            .antMatchers(HttpMethod.POST,"/api/hospital/equipment").hasAuthority("HOSPITAL")
            .antMatchers(HttpMethod.POST,"/api/hospital/maintenance/schedule").hasAuthority("HOSPITAL")
            .antMatchers(HttpMethod.POST,"/api/hospital/order").hasAuthority("HOSPITAL")
            .antMatchers(HttpMethod.GET,"/api/hospital/equipment").hasAuthority("HOSPITAL")
            .antMatchers(HttpMethod.GET,"/api/hospital/equipment/**").hasAuthority("HOSPITAL")
            .antMatchers(HttpMethod.GET,"/api/hospitals").hasAuthority("HOSPITAL")
            // .antMatchers(HttpMethod.GET,"/api/technician/maintenance").hasAnyAuthority("HOSPITAL","TECHNICIAN")
            .antMatchers("/api/supplier/**").hasAuthority("SUPPLIER")
            
            .antMatchers(HttpMethod.GET,"/api/technician/maintenance").hasAuthority("TECHNICIAN")
            .antMatchers(HttpMethod.PUT,"/api/technician/maintenance/update/**").hasAuthority("TECHNICIAN")
            
            .antMatchers(HttpMethod.PUT, "/api/technician/maintenance/respond/*").hasAuthority("TECHNICIAN")
            
            .antMatchers(HttpMethod.GET,"/api/supplier/orders").hasAnyAuthority("HOSPITAL","SUPPLIER")
            .antMatchers(HttpMethod.PUT,"/api/supplier/order/update/**").hasAuthority("SUPPLIER")
            
            .antMatchers(HttpMethod.PUT, "/api/supplier/order/respond/**").hasAuthority("SUPPLIER")
            
            .antMatchers("/api/**").authenticated()
            .and()
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
 
    @Bean
    public PasswordEncoder passwordEncoders() {
        return new BCryptPasswordEncoder();
    }
 
    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider authenticationProvider=new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(userDetailsService());
        authenticationProvider.setPasswordEncoder(passwordEncoders());
        return authenticationProvider;
    }
 
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}